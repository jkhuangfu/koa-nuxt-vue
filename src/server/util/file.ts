import * as fs from 'fs';

class File {
  public async readFile(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data).data;
  }

  public async appendFile(filePath: string, data: any) {
    const originData = await this.readFile(filePath);
    originData.push(data);
    const finalData = JSON.stringify({ data: originData });
    fs.writeFileSync(filePath, finalData);
    return true;
  }
}

export default File;
