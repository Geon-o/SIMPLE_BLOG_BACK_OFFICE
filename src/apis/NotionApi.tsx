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
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/deleteCategory', {pageId: pageId}, {
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

export {categoryListApi, saveCategoryApi, deleteCategoryApi, allPostApi, insertPostApi};