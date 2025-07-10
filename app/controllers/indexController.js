const defaultMapper = 'poi';
const indexModel = require('../models/indexModel');
const XLSX = require('xlsx');
const {getReturnMessage} = require("../modules/func-common");

exports.uploadPoi = (req, res, next) => {
    try {
        const db = require('../modules/db.psql');

        if (!req.file) {
            return res.json(getReturnMessage({
                isErr: true,
                code: 400,
                message: 'file upload failed',
                resultData: null,
                resultCnt: 0
            }));
        }

        const workbook = XLSX.read(req.file.buffer, {type: 'buffer'});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            return res.json(getReturnMessage({
                isErr: true,
                code: 400,
                message: 'data is empty',
                resultData: null,
                resultCnt: 0
            }))
        }

        const insertData = jsonData.map(item => ({
            title: item['title'] || '',
            latitude: item['latitude'] || 0,
            longitude: item['longitude'] || 0,
        }));

        // data check & reduce
        const validData = insertData.reduce((acc, item, idx) => {
            if (item.title !== '' && item.longitude > 0 && item.latitude > 0) {
                acc.push(item);
            } else {
                console.error(`skip poi item : ${item}`)
            }
            return acc;
        }, []);

        console.log('db insert/update processing data : ', validData);

        let successCount = 0;
        let errorCount = 0;

        const promises = validData.map((item, idx) => {
            return new Promise((resolve, reject) => {
                db.insert(defaultMapper, 'updatePoi', item, (count) => {
                    console.log(`poi data insert success : ${idx}, count: ${count}`);
                    successCount++;
                    resolve(count);
                }, (error) => {
                    console.error('poi data insert failed : ', error.message);
                    errorCount++;
                    resolve(0); // 에러여도 resolve로 계속 진행
                });
            });
        });

        Promise.all(promises).then(() => {
            console.log(`Success: ${successCount}, Error: ${errorCount}`);

            if (errorCount > 0) {
                return res.json(getReturnMessage({
                    isErr: true,
                    code: 207,
                    message: `Success : ${successCount}, Fail : ${errorCount}`,
                    resultData: {
                        successCount,
                        errorCount,
                    },
                    resultCnt: successCount
                }));
            }

            res.json(getReturnMessage({
                isErr: false,
                code: 200,
                message: 'data upload completed',
                resultData: {
                    uploadedCount: successCount,
                },
                resultCnt: successCount
            }));
        }).catch(error => {
            console.error('data processing error:', error);
            res.json(getReturnMessage({
                isErr: true,
                code: 500,
                message: 'DB ERROR',
                resultData: {
                    error: error.message
                },
                resultCnt: 0
            }));
        });

    } catch (error) {
        console.error('uploadPoi error : ', error);
        res.json(getReturnMessage({
            isErr: true,
            code: 500,
            message: 'File processing error',
            resultData: {error: error.message},
            resultCnt: 0
        }))
    }
};


exports.getPoiList = (req, res, next) => {
	const db = require('../modules/db.psql');

	db.select(defaultMapper, 'getPoiList', {}, (lists) => {
		res.json(getReturnMessage({
			resultData: lists || [],
			resultCnt: (lists || []).length
		}))
	}, (error) => {
		console.error('fail get poi list : ', error)
		res.json(getReturnMessage({
			isErr: true,
			code: 500,
			message: 'DB ERROR',
			resultData: [],
			resultCnt: 0
		}))
	})
}

exports.getScript = async (req, res, next) => {
    const TMAP_APP_KEY = process.env.TMAP_APP_KEY || 'empty';

    res.setHeader('Content-Type', 'application/javascript');

    const tmapApiUrl = `https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=${TMAP_APP_KEY}`;
    const tmapResponse = await fetch(tmapApiUrl);
    const tmapScriptContent = await tmapResponse.text();

    res.send(tmapScriptContent);
};