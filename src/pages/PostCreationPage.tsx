import {Box, Typography, Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Backdrop, CircularProgress} from '@mui/material';
import {useState, useEffect} from 'react';
import MDEditor from '@uiw/react-md-editor';
import {useParams, useNavigate} from 'react-router-dom';
import { categoryListApi, insertPostApi, allPostApi, fetchNotionPage, updatePostApi } from '../apis/NotionApi';
import { recordMapToMarkdown } from '../utils/recordMapToMarkdown';

interface TagProps {
    id: string;
    name: string;
}

const PostCreationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [availableTags, setAvailableTags] = useState<TagProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAndSetData = async () => {
            const tagsResponse = await categoryListApi();
            const tags: TagProps[] = tagsResponse.map((item: any) => ({
                id: item.id,
                name: item.properties.title.title[0]?.plain_text.trim(),
            }));
            setAvailableTags(tags);

            if (id) {
                setIsEditing(true);
                setIsLoading(true);
                const [posts, pageData] = await Promise.all([allPostApi(), fetchNotionPage(id)]);
                const post = posts.find(p => p.id === id);
                if (post && pageData) {
                    setTitle(post.properties.content.title[0].plain_text);
                    setSummary(post.properties.summary.rich_text[0].plain_text);
                    setSelectedTags(post.properties.tag.multi_select.map(t => t.name.trim()));
                    const markdownContent = recordMapToMarkdown(pageData);
                    setContent(markdownContent);
                }
                setIsLoading(false);
            } else {
                setIsEditing(false);
                setTitle('');
                setSummary('');
                setSelectedTags([]);
                setContent('');
            }
        };

        fetchAndSetData();
    }, [id]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const postData = {
            title,
            summary,
            tags: selectedTags.map(tagName => availableTags.find(tag => tag.name === tagName.trim())).filter(tag => tag !== undefined) as TagProps[],
            content,
        };

        const apiCall = isEditing && id ? updatePostApi(id, postData) : insertPostApi(postData);

        apiCall
            .then(() => {
                alert(`게시글 ${isEditing ? '수정' : '작성'} 완료`);
                navigate('/posts');
            })
            .catch(() => {
                alert(`게시글 ${isEditing ? '수정' : '작성'} 실패`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleTagChange = (event: any) => {
        const { target: { value } } = event;
        setSelectedTags(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <Box sx={{padding: {xs: 2, md: 3}}}>
            <Paper sx={{padding: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3, maxWidth: 'md', margin: 'auto'}}>
                <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', marginBottom: 2}}>
                    {isEditing ? '게시글 수정' : '게시글 작성'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <TextField
                            required
                            fullWidth
                            id="title"
                            label="제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{mb: 3}}
                        />
                        <TextField
                            required
                            fullWidth
                            id="summary"
                            label="요약"
                            multiline
                            rows={4}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            sx={{mb: 3}}
                        />
                        <FormControl sx={{mb: 3, width: '50%'}}>
                            <InputLabel id="tags-select-label">태그</InputLabel>
                            <Select
                                labelId="tags-select-label"
                                id="tags-select"
                                multiple
                                value={selectedTags}
                                onChange={handleTagChange}
                                input={<OutlinedInput id="select-multiple-chip" label="태그" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {availableTags.map((tag) => (
                                    <MenuItem
                                        key={tag.id}
                                        value={tag.name}
                                    >
                                        {tag.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{mb: 3}}>
                            <MDEditor
                                value={content}
                                onChange={(value) => setContent(value || '')}
                                height={400}
                            />
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button type="submit" sx={{backgroundColor: '#2c5e4c', color: '#fff', borderRadius: '13px', mr: 2 }}>
                                {isEditing ? '수정' : '업로드'}
                            </Button>
                            {isEditing && (
                                <Button
                                    onClick={() => navigate('/post', { state: { pageId: id } })}
                                   sx={{ backgroundColor: '#2c5e4c', color: '#ffffff', borderRadius: '13px'}}
                                >
                                    취소
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            </Paper>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default PostCreationPage;