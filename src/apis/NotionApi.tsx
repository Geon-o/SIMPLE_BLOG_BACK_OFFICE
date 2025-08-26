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

    return {
        categoryListApi,
        subCategoryListApi
    }
}