// 导出csv

import type {csvHeaderINTF} from "@/interfaces/csvHeaderINTF"
export function exportCsv(columns:csvHeaderINTF[], dataList:Map<string,string>[], fileName:string) {
    let title = columns.map(item => item.title);
    let keyArray = columns.map(item => item.key);
    let str = [];
    str.push(title.join(',') + '\n');
    for (let i = 0; i < dataList.length; i++) {
        const temp = [];
        for (let j = 0; j < keyArray.length; j++) {
            console.log(dataList[i])
            temp.push(dataList[i].get(keyArray[j]));
        }
        str.push(temp.join(',') + '\n');
    }
    console.log(str)
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str.join(''));
    let downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
