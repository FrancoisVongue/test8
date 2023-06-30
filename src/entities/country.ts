import { YamlNode } from "../parser/parser";

export class Country {
    name: string;
    code: string;

    constructor(node: YamlNode) {
        if(node.firstLine !== 'country') {
            throw new Error(`Invalid node first line:${node.firstLine}`);
        }
        
        this.name = YamlNode.findAndParseValue('name', 'string', node);
        this.code = YamlNode.findAndParseValue('code', 'string', node);
    }
}