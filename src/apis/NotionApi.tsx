import axios from "axios";

const categoryListApi = async () => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/categoryList')
    return res.data.results;
};

const saveCategoryApi = async (saveData: { name: string }) => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/saveCategory', {saveData: saveData}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data;
};

const editCategoryApi = async (editData: { name: string }, pageId: string | null) => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/editCategory', {editData: editData, pageId: pageId}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return res.data;
}

const deleteCategoryApi = async (pageId: string) => {
    const res = await axios.post('https://notion-proxy-api.vercel.app/api/deleteCategory', {pageId: pageId}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data;
}

export { categoryListApi, saveCategoryApi, editCategoryApi, deleteCategoryApi };