import {
    Box,
    Chip,
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
    Tabs,
    Tab,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useState} from 'react';
import {Search, Edit, Delete} from '@mui/icons-material';

// 스타일이 적용된 TableCell 컴포넌트
const StyledTableCell = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    borderBottom: `2px solid ${theme.palette.divider}`
}));

// --- 예시 데이터 타입 및 데이터 --- //
interface Post {
    id: string;
    title: string;
    category: string;
    tags: string[];
    author: string;
    createdAt: string;
    status: 'Published' | 'Draft';
}

const mockPosts: Post[] = [
    {
        id: '1',
        title: 'React 상태 관리 라이브러리 비교',
        category: 'Frontend',
        tags: ['React', 'State Management', 'Redux', 'MobX'],
        author: 'John Doe',
        createdAt: '2023-10-27',
        status: 'Published',
    },
    {
        id: '2',
        title: 'Next.js 14의 새로운 기능',
        category: 'Frontend',
        tags: ['Next.js', 'React', 'Web Development'],
        author: 'Jane Smith',
        createdAt: '2023-10-26',
        status: 'Published',
    },
    {
        id: '3',
        title: 'TypeScript 제대로 사용하기',
        category: 'Programming',
        tags: ['TypeScript', 'Best Practice'],
        author: 'Peter Jones',
        createdAt: '2023-10-25',
        status: 'Draft',
    },
    {
        id: '4',
        title: 'Node.js와 Express로 REST API 만들기',
        category: 'Backend',
        tags: ['Node.js', 'Express', 'API'],
        author: 'John Doe',
        createdAt: '2023-10-24',
        status: 'Published',
    },
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const PostManagementPage = () => {
    const [posts] = useState<Post[]>(mockPosts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{padding: {xs: 2, md: 3}}}>
            <Paper sx={{padding: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3}}>
                <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', marginBottom: 2}}>
                    게시물 관리
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={selectedTab} onChange={handleTabChange} aria-label="post management tabs">
                        <Tab label="목록" />
                        <Tab label="작성" />
                    </Tabs>
                </Box>

                <TabPanel value={selectedTab} index={0}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginBottom: 3,
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="게시물 검색..."
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <TableContainer>
                        <Table sx={{minWidth: 650}} aria-label="post table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>제목</StyledTableCell>
                                    <StyledTableCell>카테고리</StyledTableCell>
                                    <StyledTableCell>태그</StyledTableCell>
                                    <StyledTableCell>작성자</StyledTableCell>
                                    <StyledTableCell>작성일</StyledTableCell>
                                    <StyledTableCell>상태</StyledTableCell>
                                    <StyledTableCell align="right">작업</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPosts.map((post) => (
                                    <TableRow key={post.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell sx={{fontWeight: 'medium'}}>{post.title}</TableCell>
                                        <TableCell>{post.category}</TableCell>
                                        <TableCell>
                                            <Box sx={{display: 'flex', gap: 0.5, flexWrap: 'wrap'}}>
                                                {post.tags.map(tag => <Chip key={tag} label={tag} size="small"/>)}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{post.author}</TableCell>
                                        <TableCell>{post.createdAt}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={post.status}
                                                color={post.status === 'Published' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="primary">
                                                <Edit fontSize="small"/>
                                            </IconButton>
                                            <IconButton size="small" color="error">
                                                <Delete fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={selectedTab} index={1}>
                    <Typography>게시물 작성 폼이 여기에 표시됩니다.</Typography>
                </TabPanel>

            </Paper>
        </Box>
    );
};

export default PostManagementPage;