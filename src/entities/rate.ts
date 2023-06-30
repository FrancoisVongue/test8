import { YamlNode } from "../parser/parser";

export class Rate {
    from: string;
    to: string;
    in: number;
    out: number;
    reserve: number;
    date: Date;

    constructor(node: YamlNode) {
        if(node.firstLine !== 'rate') {
            throw new Error(`Invalid node first line:${node.firstLine}`);
        }
        
        this.from = YamlNode.findAndParseValue('from', 'string', node);
        this.to = YamlNode.findAndParseValue('to', 'string', node);
        this.in = YamlNode.findAndParseValue('in', 'number', node);
        this.out = YamlNode.findAndParseValue('out', 'number', node);
        this.reserve = YamlNode.findAndParseValue('reserve', 'number', node);
        this.date = YamlNode.findAndParseValue('date', 'date', node);
    }
}