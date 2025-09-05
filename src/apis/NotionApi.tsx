import axios from "axios";

const categoryListApi = async () => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/categoryList')
    return res.data.results;
};

const saveCategoryApi = async (saveData: { title: string }) => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/saveCategory', {saveData: saveData}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data;
};

const deleteCategoryApi = async (pageId: string) => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/deleteUtil', {pageId: pageId}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data;
}

const allPostApi = async () => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/allPostList')

    return res.data.results;
};

interface PostData {
    title: string;
    summary: string;
    // imageUrl: string;
    tags: { id: string; name: string; }[];
    content: string;
}

const insertPostApi = async (postData: PostData) => {
    const res: any = await axios.post('https://notion-proxy-api.vercel.app/api/insertPost', {postData})

    return res.data.results;
}

const updatePostApi = async (pageId: string, postData: PostData) => {
    const res: any = await axios.post('https://notion-proxy-api.vercel.app/api/updatePost', { pageId, postData });
    return res.data.results;
}

const deletePostApi = async (pageId: string) => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/deleteUtil', {pageId: pageId}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data.results;
}

const fetchNotionPage = async (pageId: string) => {
    try {
        const response = await fetch(`https://notion-proxy-api.vercel.app/api/getPage?pageId=${pageId}`)
        const data = await response.json()
        return data

    } catch (err) {
        console.error('Failed to fetch Notion page:', err)
        return null
    }
}

export {categoryListApi, saveCategoryApi, deleteCategoryApi, allPostApi, insertPostApi, deletePostApi, fetchNotionPage, updatePostApi};