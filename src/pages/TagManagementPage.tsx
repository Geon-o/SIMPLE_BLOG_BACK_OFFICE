import {
    Box,
    Button,
    TextField,
    Chip,
} from '@mui/material';
import {useState, useEffect} from 'react';
import {Add} from '@mui/icons-material';
import {categoryListApi, saveCategoryApi, deleteCategoryApi} from '../apis/NotionApi';
import TagInput from "@/components/TagInput.tsx";

interface Category {
    id: string;
    name: string;
}

export default function TagManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');


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
            title: newCategoryName,
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

    return (
        <Box sx={{padding: {xs: 2, md: 3}}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 3,
                flexWrap: 'wrap',
            }}>
                <TextField
                    size="small"
                    placeholder="태그 검색..."
                    onChange={handleSearch}
                />
                <Button
                    variant="contained"
                    startIcon={<Add/>}
                    sx={{textTransform: 'none', fontWeight: 'bold', backgroundColor: '#2c5e4c', '&:hover': { backgroundColor: '#2c5e4c' }}}
                    onClick={handleAddNewCategory}
                    disabled={isAdding}
                >
                    새 태그 추가
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 3 }}>
                {isAdding && (
                    <TagInput
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onSave={handleSaveNewCategory}
                        onCancel={handleCancelNewCategory}
                    />
                )}
                {filteredCategories.map((category) => (
                        <Chip
                            key={category.id}
                            label={category.name}
                            onDelete={() => handleDeleteCategory(category)}
                            sx={{ borderColor: '#2c5e4c', color: '#2c5e4c' }}
                            variant="outlined"
                        />
                ))}
            </Box>
        </Box>
    );
};