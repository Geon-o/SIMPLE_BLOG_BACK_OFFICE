
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
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import NotionApi from '../apis/NotionApi';

// 스타일이 적용된 TableCell 컴포넌트
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100], // 부드러운 회색 배경
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  borderBottom: `2px solid ${theme.palette.divider}`
}));

// --- 예시 데이터 타입 및 데이터 --- //
interface Category {
  id: string;
  name: string;
  path: string;
  parentId: string | null; // 최상위 카테고리는 parentId가 null
  parentName?: string;
}

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { categoryListApi, subCategoryListApi } = NotionApi();

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryData = await categoryListApi();
      const subCategoryData = await subCategoryListApi();

      const transformedCategories = categoryData.map((item: any) => ({
        id: item.id,
        name: item.properties.title.title[0]?.plain_text || '',
        path: item.properties.path.rich_text[0]?.plain_text || '',
        parentId: null,
      }));

      const parentTitleToIdMap = new Map(transformedCategories.map(c => [c.name, c.id]));

      const transformedSubCategories = subCategoryData.map((item: any) => {
        const parentTitle = item.properties.FK?.select?.name || null;
        const parentId = parentTitle ? parentTitleToIdMap.get(parentTitle) : null;
        return {
          id: item.id,
          name: item.properties.title.title[0]?.plain_text || '',
          path: item.properties.path.rich_text[0]?.plain_text || '',
          parentId: parentId,
          parentName: parentTitle,
        }
      });

      const sorted: Category[] = [];
      const parents = transformedCategories.sort((a, b) => a.name.localeCompare(b.name));

      parents.forEach(parent => {
          sorted.push(parent);
          const children = transformedSubCategories
              .filter(child => child.parentId === parent.id)
              .sort((a, b) => a.name.localeCompare(b.name));
          sorted.push(...children);
      });

      setCategories(sorted);
    };

    fetchCategories();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: { xs: 2, md: 3 } }}>
      <Paper sx={{ padding: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          카테고리 관리
        </Typography>

        {/* --- 상단 툴바 --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="카테고리 검색..."
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            새 카테고리 추가
          </Button>
        </Box>

        {/* --- 카테고리 테이블 --- */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="category table">
            <TableHead>
              <TableRow>
                <StyledTableCell>카테고리명 (Title)</StyledTableCell>
                <StyledTableCell>경로 (Path)</StyledTableCell>
                <StyledTableCell>상위 카테고리 (FK)</StyledTableCell>
                <StyledTableCell align="right">작업</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ paddingLeft: category.parentId ? 5 : 2 }}>
                    {category.parentId && '└ '}
                    {category.name}
                  </TableCell>
                  <TableCell>{category.path}</TableCell>
                  <TableCell>{category.parentName || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CategoryManagementPage;
