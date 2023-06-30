import { YamlNode } from "../parser/parser";
import { Exchange } from "./exchange";
import { Rate } from "./rate";

export class ExchangeOffice {
    id: number;
    name: string;
    country: string;
    exchanges?: Exchange[]
    rates?: Rate[]

    constructor(node: YamlNode) {
        if(node.firstLine !== 'exchange-office') {
            throw new Error(`Invalid node first line:${node.firstLine}`);
        }
        
        this.id = YamlNode.findAndParseValue('id', 'number', node);
        this.name = YamlNode.findAndParseValue('name', 'string', node);
        this.country = YamlNode.findAndParseValue('country', 'string', node);

        const exchangesNodes = node.children.find(c => c.firstLine === 'exchanges')?.children ?? [];
        if(exchangesNodes.length) {
            this.exchanges = exchangesNodes.map(en => new Exchange(en));
        }

        const ratesNodes = node.children.find(c => c.firstLine === 'rates')?.children ?? [];
        if(ratesNodes.length) {
            this.rates = ratesNodes.map(rn => new Rate(rn));
        }
    }
}