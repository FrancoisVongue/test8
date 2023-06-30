import { YamlNode } from "../parser/parser";

export class Exchange {
    from: string;
    to: string;
    ask: number;
    date: Date;

    constructor(node: YamlNode) {
        if(node.firstLine !== 'exchange') {
            throw new Error(`Invalid node first line:${node.firstLine}`);
        }
        
        this.from = YamlNode.findAndParseValue('from', 'string', node);
        this.to = YamlNode.findAndParseValue('to', 'string', node);
        this.ask = YamlNode.findAndParseValue('ask', 'number', node);
        this.date = YamlNode.findAndParseValue('date', 'date', node);
    }
}