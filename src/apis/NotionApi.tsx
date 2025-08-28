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

    const saveCategoryApi = async (saveData: { name: string, path: string, parentId: string | null }) => {
        const res = await axios.post('https://notion-proxy-api.vercel.app/api/saveCategory', {saveData: saveData}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data;
    };

    const editCategoryApi = async (editData: { name: string, path: string, parentName: string | null }, pageId: string | null) => {
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

    return {
        categoryListApi,
        subCategoryListApi,
        saveCategoryApi,
        editCategoryApi,
        deleteCategoryApi
    }
}