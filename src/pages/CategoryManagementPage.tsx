
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

// 스타일이 적용된 TableCell 컴포넌트
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100], // 부드러운 회색 배경
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  borderBottom: `2px solid ${theme.palette.divider}`
}));

// --- 예시 데이터 타입 및 데이터 --- //
interface Category {
  id: number;
  name: string;
  path: string;
  parentId: number | null; // 최상위 카테고리는 parentId가 null
}

const mockCategories: Category[] = [
  { id: 1, name: '프로그래밍', path: '/programming', parentId: null },
  { id: 101, name: 'React', path: '/programming/react', parentId: 1 },
  { id: 102, name: 'Java', path: '/programming/java', parentId: 1 },
  { id: 2, name: '디자인', path: '/design', parentId: null },
  { id: 201, name: 'UI/UX', path: '/design/ui-ux', parentId: 2 },
  { id: 3, name: '마케팅', path: '/marketing', parentId: null },
];

// 계층 구조로 데이터 정렬하는 함수
const getSortedCategories = (categories: Category[]) => {
  const categoryMap = new Map(categories.map(c => [c.id, { ...c, children: [] as Category[] }]));
  const sorted: Category[] = [];
  
  categories.forEach(c => {
    if (c.parentId) {
      categoryMap.get(c.parentId)?.children.push(c as any);
    } 
  });

  categories.forEach(c => {
    if (!c.parentId) {
      sorted.push(c);
      const children = categoryMap.get(c.id)?.children || [];
      sorted.push(...children);
    }
  });

  return sorted;
};


const CategoryManagementPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // API 요청 시뮬레이션
    const sortedData = getSortedCategories(mockCategories);
    setCategories(sortedData);
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
