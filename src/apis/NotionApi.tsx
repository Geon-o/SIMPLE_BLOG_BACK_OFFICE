import axios from "axios";

export default function NotionApi() {

    const categoryListApi = async () => {
        const res = await axios.post('https://notion-proxy-api.vercel.app/api/categoryList')
        return res.data.results;
    };

    const subCategoryListApi = async () => {
        const res = await axios.post('https://notion-proxy-api.vercel.app/api/subCategoryList')
        return res.data.results;
    };

    const saveCategoryApi = async (saveData) => {
        const res = await axios.post('https://notion-proxy-api.vercel.app/api/saveCategory', {saveData: saveData}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data;
    };

    const editCategoryApi = async (editData, pageId) => {
        const res = await axios.post('https://notion-proxy-api.vercel.app/api/editCategory', {editData: editData, pageId: pageId}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return res.data;
    }

    const deleteCategoryApi = async (pageId) => {
        const res = await axios.post('https://notion-proxy-api.vercel.app/api/deleteCategory', {pageId: pageId}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data;
    }

    return {
        categoryListApi,
        subCategoryListApi,
        saveCategoryApi,
        editCategoryApi,
        deleteCategoryApi
    }
}