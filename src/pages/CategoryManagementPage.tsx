import {
    Box,
    Button,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useState, useEffect} from 'react';
import {Search, Add, Edit, Delete} from '@mui/icons-material';
import NotionApi from '../apis/NotionApi';
import Dropdown from "@/components/Dropdown.tsx";

// 스타일이 적용된 TableCell 컴포넌트
const StyledTableCell = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.grey[100], // 부드러운 회색 배경
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    borderBottom: `2px solid ${theme.palette.divider}`
}));

// --- 예시 데이터 타입 및 데이터 --- //
interface Category {
    id: string;
    pageId: string;
    name: string;
    path: string;
    parentId: string | null; // 최상위 카테고리는 parentId가 null
    parentName?: string;
}

const CategoryManagementPage = () => {
    const {categoryListApi, subCategoryListApi, saveCategoryApi, editCategoryApi, deleteCategoryApi} = NotionApi();

    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryPath, setNewCategoryPath] = useState('');
    const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryData, setEditingCategoryData] = useState<{ name: string; path: string; parentName: string | null }>({ name: '', path: '', parentName: null });


    const fetchCategories = async () => {
        const categoryData = await categoryListApi();
        const subCategoryData = await subCategoryListApi();

        const transformedCategories: Category[] = categoryData.map((item: any) => ({
            id: item.id,
            pageId: item.id,
            name: item.properties.title.title[0]?.plain_text || '',
            path: item.properties.path.rich_text[0]?.plain_text || '',
            parentId: null,
        }));

        const parentTitleToIdMap = new Map(transformedCategories.map((c: Category) => [c.name, c.id]));

        const transformedSubCategories: Category[] = subCategoryData.map((item: any) => {
            const parentTitle = item.properties.FK?.select?.name || null;
            const parentId = parentTitle ? parentTitleToIdMap.get(parentTitle) : null;
            return {
                id: item.id,
                pageId: item.id,
                name: item.properties.title.title[0]?.plain_text || '',
                path: item.properties.path.rich_text[0]?.plain_text || '',
                parentId: parentId,
                parentName: parentTitle,
            }
        });

        const sorted: Category[] = [];
        const parents = transformedCategories.sort((a: Category, b: Category) => a.name.localeCompare(b.name));

        parents.forEach((parent: Category) => {
            sorted.push(parent);
            const children = transformedSubCategories
                .filter((child: Category) => child.parentId === parent.id)
                .sort((a: Category, b: Category) => a.name.localeCompare(b.name));
            sorted.push(...children);
        });

        setCategories(sorted);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /**
     * =======================================================================
     *                            카테고리 생성
     * =======================================================================
     */
    const handleAddNewCategory = () => {
        setIsAdding(true);
    }

    const handleSaveNewCategory = () => {
        const saveData = {
            name: newCategoryName,
            path: newCategoryPath,
            parentId: selectedParentCategory
        }

        saveCategoryApi(saveData).then(async () => {
            handleCancelNewCategory();
            alert('카테고리가 생성됐습니다.');
            await fetchCategories();
        }).catch(() => {
            alert("저장하던 중 문제발생.");
        })
    }

    const handleCancelNewCategory = () => {
        setIsAdding(false);
        setNewCategoryName('');
        setNewCategoryPath('');
        setSelectedParentCategory(null);
    }
    // =======================================================================

    /**
     * =======================================================================
     *                            카테고리 수정
     * =======================================================================
     * @param newValue
     */
    const handleSelectParentCategory = (newValue: string | null) => {
        setSelectedParentCategory(newValue);
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategoryId(category.id);
        const parentName = categories.find(c => c.id === category.parentId)?.name || null;
        setEditingCategoryData({ name: category.name, path: category.path, parentName: parentName });
    };

    const handleUpdateCategory = (category: Category) => {
        const subCategoryData = categories.find(c => c.parentId === category.id);

        editCategoryApi(editingCategoryData, editingCategoryId).then(async () => {
            if (subCategoryData) {
                const editData = {
                    name: subCategoryData.name as string,
                    path: subCategoryData.path as string,
                    parentName: editingCategoryData.name as string || null
                }

                await editCategoryApi(editData, subCategoryData.pageId);
            }

            alert('카테고리가 수정됐습니다.');
            setEditingCategoryId(null);
            await fetchCategories();

        })
            .catch(() => {
                alert("수정하던 중 문제발생.");
            })
    };
    // =======================================================================

    const handleDeleteCategory = (category: Category) => {
        if (confirm("삭제?")) {

            if (categories.find(c => c.parentName === category.name)) return alert('하위 카테고리가 존재하여 삭제하지 못함.');

            deleteCategoryApi(category.id).then(async () => {
                alert('삭제완');
                await fetchCategories();
            })
                .catch(() => {
                    alert("삭제하던 중 문제발생.");
                })
        }
    }

    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditingCategoryData({ name: '', path: '', parentName: null });
    };

    const parentCategoryOptions = categories.filter(category => category.parentId === null).map(category => ({
        value: category.id,
        label: category.name
    }));

    return (
        <Box sx={{padding: {xs: 2, md: 3}}}>
            <Paper sx={{padding: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3}}>
                <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', marginBottom: 2}}>
                    카테고리 관리
                </Typography>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 3,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="카테고리 검색..."
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<Add/>}
                        sx={{textTransform: 'none', fontWeight: 'bold'}}
                        onClick={handleAddNewCategory}
                        disabled={isAdding}
                    >
                        새 카테고리 추가
                    </Button>
                </Box>

                <TableContainer>
                    <Table sx={{minWidth: 650}} aria-label="category table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>카테고리명 (Title)</StyledTableCell>
                                <StyledTableCell>경로 (Path)</StyledTableCell>
                                <StyledTableCell>상위 카테고리 (FK)</StyledTableCell>
                                <StyledTableCell align="right">작업</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isAdding && (
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            size={"small"}
                                            variant={"outlined"}
                                            placeholder={"카테고리명 입력"}
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            size={"small"}
                                            variant={"outlined"}
                                            placeholder={"path 입력"}
                                            value={newCategoryPath}
                                            onChange={(e) => setNewCategoryPath(e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown label={""} options={parentCategoryOptions}
                                                  value={selectedParentCategory} onChange={handleSelectParentCategory}/>
                                    </TableCell>
                                    <TableCell align={"right"}>
                                        <Button onClick={handleSaveNewCategory} size={"small"}>저장</Button>
                                        <Button onClick={handleCancelNewCategory} size={"small"}>취소</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredCategories.map((category) => (
                                editingCategoryId === category.id ? (
                                    <TableRow key={category.id}>
                                        <TableCell sx={{ paddingLeft: category.parentId ? 5 : 2 }}>
                                            {category.parentId && '└ '}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={editingCategoryData.name}
                                                onChange={(e) => setEditingCategoryData({ ...editingCategoryData, name: e.target.value })}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={editingCategoryData.path}
                                                onChange={(e) => setEditingCategoryData({ ...editingCategoryData, path: e.target.value })}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {category.parentId ? (
                                                <Dropdown
                                                    label=""
                                                    options={parentCategoryOptions}
                                                    value={editingCategoryData.parentName}
                                                    onChange={(newValue) => setEditingCategoryData({ ...editingCategoryData, parentName: newValue })}
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button onClick={() => handleUpdateCategory(category)} size="small">저장</Button>
                                            <Button onClick={handleCancelEdit} size="small">취소</Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow key={category.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ paddingLeft: category.parentId ? 5 : 2 }}>
                                            {category.parentId && '└ '}
                                            {category.name}
                                        </TableCell>
                                        <TableCell>{category.path}</TableCell>
                                        <TableCell>{category.parentName || '-'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="primary" onClick={() => handleEditCategory(category)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDeleteCategory(category)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default CategoryManagementPage;
