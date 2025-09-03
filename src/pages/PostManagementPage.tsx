import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Correct import for Grid v7+
import {allPostApi} from '../apis/NotionApi';
import {useEffect, useState} from "react";
import {Search, Edit, Delete} from "@mui/icons-material";

interface Post {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
    tags: string[];
    createdAt: string;
}

const PostManagementPage = () => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        allPostApi()
            .then((r) => {
                const fetchedPosts: Post[] = r.map((post: any) => ({
                    id: post.id,
                    title: post.properties.content.title[0].plain_text,
                    summary: post.properties.summary.rich_text[0].plain_text,
                    imageUrl: post.properties.imageUrl.rich_text[0].plain_text,
                    tags: post.properties.tag.multi_select.map((tag: any) => tag.name),
                    createdAt: post.created_time,
                }));
                setPosts(fetchedPosts);
            });
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{padding: {xs: 2, md: 3}}}>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 3}}>
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

            <Grid container spacing={3}>
                {filteredPosts.map((post) => (
                    <Grid gridColumn={{ xs: 'span 12', sm: 'span 6', md: 'span 4' }} key={post.id}>
                        <Card
                            sx={(theme) => ({
                                height: '100%', display: 'flex', flexDirection: 'column',
                                transition: theme.transitions.create(['transform', 'box-shadow']),
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[6],
                                },
                            })}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={post.imageUrl}
                                alt={post.title}
                            />
                            <CardContent sx={{flexGrow: 1}}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {post.summary}
                                </Typography>
                                <Box sx={{mt: 2}}>
                                    {post.tags.map(tag => <Chip key={tag} label={tag} size="small"
                                                               sx={{mr: 0.5, mb: 0.5}}/>)}
                                </Box>
                            </CardContent>
                            <CardActions sx={{justifyContent: 'flex-end'}}>
                                <IconButton size="small" color="primary">
                                    <Edit fontSize="small"/>
                                </IconButton>
                                <IconButton size="small" color="error">
                                    <Delete fontSize="small"/>
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PostManagementPage;

