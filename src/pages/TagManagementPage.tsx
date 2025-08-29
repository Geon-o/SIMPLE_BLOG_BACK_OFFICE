import {
    Box,
    Button,
    InputAdornment,
    Paper,
    TextField,
    Chip,
} from '@mui/material';
import {useState, useEffect} from 'react';
import {Search, Add} from '@mui/icons-material';
import {categoryListApi, saveCategoryApi, editCategoryApi, deleteCategoryApi} from '../apis/NotionApi';
import FormContainer from "@/components/FormContainer.tsx";



// --- 예시 데이터 타입 및 데이터 --- //
interface Category {
    id: string;
    name: string;
}

export default function TagManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryData, setEditingCategoryData] = useState<{ name: string }>({ name: '' });


    const fetchCategories = async () => {
        const categoryData = await categoryListApi();
        const transformedCategories: Category[] = categoryData.map((item: any) => ({
            id: item.id,
            name: item.properties.title.title[0]?.plain_text || '',
        }));
        setCategories(transformedCategories);
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
     *                            태그 생성
     * =======================================================================
     */
    const handleAddNewCategory = () => {
        setIsAdding(true);
    }

    const handleSaveNewCategory = () => {
        const saveData = {
            name: newCategoryName,
        }

        saveCategoryApi(saveData).then(async () => {
            handleCancelNewCategory();
            alert('태그가 생성됐습니다.');
            await fetchCategories();
        }).catch(() => {
            alert("저장하던 중 문제발생.");
        })
    }

    const handleCancelNewCategory = () => {
        setIsAdding(false);
        setNewCategoryName('');
    }
    // =======================================================================

    /**
     * =======================================================================
     *                            태그 수정
     * =======================================================================
     */
    const handleEditCategory = (category: Category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryData({ name: category.name });
    };

    const handleUpdateCategory = () => {
        const editData = {
            name: editingCategoryData.name,
        }

        editCategoryApi(editData, editingCategoryId).then(async () => {
            alert('태그가 수정됐습니다.');
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
        setEditingCategoryData({ name: '' });
    };

    return (
        <Box sx={{padding: {xs: 2, md: 3}}}>
            <Paper sx={{padding: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3}}>
                <FormContainer title="태그 관리">

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
                        placeholder="태그 검색..."
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
                        새 태그 추가
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 3 }}>
                    {isAdding && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="태그명 입력"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <Button onClick={handleSaveNewCategory} size="small" variant="contained">저장</Button>
                            <Button onClick={handleCancelNewCategory} size="small" variant="outlined">취소</Button>
                        </Box>
                    )}
                    {filteredCategories.map((category) => (
                        editingCategoryId === category.id ? (
                            <Box key={category.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    value={editingCategoryData.name}
                                    onChange={(e) => setEditingCategoryData({ name: e.target.value })}
                                />
                                <Button onClick={handleUpdateCategory} size="small" variant="contained">저장</Button>
                                <Button onClick={handleCancelEdit} size="small" variant="outlined">취소</Button>
                            </Box>
                        ) : (
                            <Chip
                                key={category.id}
                                label={category.name}
                                onDelete={() => handleDeleteCategory(category)}
                                onClick={() => handleEditCategory(category)}
                                color="primary"
                                variant="outlined"
                            />
                        )
                    ))}
                </Box>
            </FormContainer>
            </Paper>
        </Box>
    );
};


