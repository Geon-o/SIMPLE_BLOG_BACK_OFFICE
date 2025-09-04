import {Box, Typography, Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Backdrop, CircularProgress} from '@mui/material';
import {useState, useEffect} from 'react';
import MDEditor from '@uiw/react-md-editor';
import { categoryListApi, insertPostApi } from '../apis/NotionApi';

interface TagProps {
    id: string;
    name: string;
}

const PostCreationPage = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    // const [imageUrl, setImageUrl] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [content, setContent] = useState('**Hello world!!!**');
    const [availableTags, setAvailableTags] = useState<TagProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await categoryListApi();
                const tags: TagProps[] = response.map((item: any) => ({
                    id: item.id,
                    name: item.properties.title.title[0]?.plain_text,
                }));
                setAvailableTags(tags);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchTags();
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const postData = {
            title,
            summary,
            // imageUrl,
            tags: selectedTags.map(tagName => availableTags.find(tag => tag.name === tagName)).filter(tag => tag !== undefined) as TagProps[],
            content,
        };

        insertPostApi(postData)
            .then(() => {
                alert('업로드 완료');
            })
            .catch(() => {
                alert('업로드 실패');
            })
            .finally(() => {
                setIsLoading(false);
            })
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
                    게시글 작성
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
                        {/*<TextField*/}
                        {/*    required*/}
                        {/*    fullWidth*/}
                        {/*    id="imageUrl"*/}
                        {/*    label="이미지 URL"*/}
                        {/*    value={imageUrl}*/}
                        {/*    onChange={(e) => setImageUrl(e.target.value)}*/}
                        {/*    sx={{mb: 3}}*/}
                        {/*/>*/}
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
                            <Button type="submit" sx={{backgroundColor: '#2c5e4c', color: '#fff'}}>
                                업로드
                            </Button>
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