import { RequestHandler } from "express";
import { DataRuntime } from "../helper/Data";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { OB11Config } from "@/webui/ui/components/WebApi";
const isEmpty = (data: any) => data === undefined || data === null || data === '';
export const OB11GetConfigHandler: RequestHandler = async (req, res) => {
    let isLogin = await DataRuntime.getQQLoginStatus();
    // if (!isLogin) {
    //     res.send({
    //         code: -1,
    //         message: 'Not Login'
    //     });
    //     return;
    // }
    const uin = await DataRuntime.getQQLoginUin();
    let configFilePath = resolve(__dirname, `./config/onebot11_${uin}.json`);
    //console.log(configFilePath);
    let data: OB11Config;
    try {
        data = JSON.parse(existsSync(configFilePath) ? readFileSync(configFilePath).toString() : readFileSync(resolve(__dirname, `./config/onebot11.json`)).toString());
    }
    catch (e) {
        data = {} as OB11Config;
        res.send({
            code: -1,
            message: 'Config Get Error'
        });
        return;
    }
    res.send({
        code: 0,
        message: 'success',
        data: data
    });
    return;
}
export const OB11SetConfigHandler: RequestHandler = async (req, res) => {
    let isLogin = await DataRuntime.getQQLoginStatus();
    if (!isLogin) {
        res.send({
            code: -1,
            message: 'Not Login'
        });
        return;
    }
    if (isEmpty(req.body.config)) {
        res.send({
            code: -1,
            message: 'config is empty'
        });
        return;
    }
    let configFilePath = resolve(__dirname, `./config/onebot_${await DataRuntime.getQQLoginUin()}.json`);
    try {
        require(configFilePath);
    }
    catch (e) {
        configFilePath = resolve(__dirname, `./config/onebot.json`);
    }
    writeFileSync(configFilePath, JSON.stringify(req.body.config, null, 4));
    res.send({
        code: 0,
        message: 'success'
    });
    return;
}