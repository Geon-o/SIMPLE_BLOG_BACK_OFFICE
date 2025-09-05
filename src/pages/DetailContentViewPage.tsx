import {useEffect, useState} from 'react';
import {NotionRenderer} from 'react-notion-x';
import {useLocation, useNavigate} from 'react-router-dom';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';
import {Code} from 'react-notion-x/build/third-party/code';
import {Collection} from 'react-notion-x/build/third-party/collection';
import {Equation} from 'react-notion-x/build/third-party/equation';
import {CircularProgress, Box, Button} from "@mui/material";
import {fetchNotionPage} from "@/apis/NotionApi.tsx";

export const DetailContentViewPage = () => {
    const [recordMap, setRecordMap] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const pageId = location.state?.pageId;

    useEffect(() => {
        if (pageId) {
            setLoading(true);
            fetchNotionPage(pageId)
                .then((data) => {
                    setRecordMap(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [pageId]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size="large" /></Box>;
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button sx={{ backgroundColor: '#2c5e4c', color: '#ffffff', borderRadius: '13px'}} onClick={() => navigate(`/posts/edit/${pageId}`)} >
                    수정
                </Button>
            </Box>
            <style>{`
              .notion-collection-page-properties {
                display: none !important;
              }
              .notion-header {
                display: none !important;
              }
            `}</style>
            <div style={{maxWidth: 768, margin: '0 auto ', marginTop: '100px'}}>
                {recordMap && (
                    <NotionRenderer
                        recordMap={recordMap}
                        fullPage={false}
                        darkMode={false}
                        components={{
                            Code,
                            Collection,
                            Equation,
                        }}
                    />
                )}
            </div>
        </>
    );
};


