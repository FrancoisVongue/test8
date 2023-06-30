export type SimleType = 'string' | 'date' | 'number';
type parseValueResponseType<T extends SimleType> = 
    T extends 'string' ? string : 
    T extends 'date' ? Date :
    T extends 'number' ? number : never;

export class YamlNode {
    constructor(
        public firstLine: string,
        public children: YamlNode[]
    ) {}

    static getIndentation(s: string | null | undefined): number {
        if(!s) {
            return 0;
        }

        const str = s.trimStart();
        const result = s.length - str.length;
        return result;
    }
    
    static parseValueLine(line: string) {
        const [field, value] = line.split(' = ').map(s => s.trim());
        return [field, value] as const;
    }

    static findAndParseValue<T extends SimleType>(name: string, type: T, node: YamlNode) {
        const valuePair = node.children
            .filter(c => c.children.length === 0)
            .map(c => YamlNode.parseValueLine(c.firstLine))
            .find(([field, value]) => name === field);
        
        if(!valuePair) {
            throw new Error(`Could not find:${name} in node:${node.firstLine}`);
        }
        const [_, value] = valuePair;

        const result = YamlNode.parseValue(type, value);
        if(!result) {
            throw new Error(`Failed to parse${name} in node ${node.firstLine}`);
        }

        return result;
    }

    static parseValue<T extends SimleType>(
        type: T,
        value: string
    ): parseValueResponseType<T> {
        switch(type) {
            case "date": {
                const ISOdate = value.trim().split(' ').join('T');
                const result = new Date(ISOdate);

                return result as any;
            }
            case 'number': {
                return +(value.trim()) as any;
            }
            case 'string': {
                return value.trim() as any;
            }
            default: {
                throw new Error(`Unknown value type: ${type}`);
            }
        }
    }

    static fromLines(
        linesCopy: string[], 
    ): YamlNode[] {
        const lines = [...linesCopy];

        const indentation = YamlNode.getIndentation(lines[0]);
        const nodes: YamlNode[] = [];

        while(lines.length) {
            const node = new YamlNode(lines.shift()!.trim(), []);
            const childLines: string[] = [];
            let lineIndentation = YamlNode.getIndentation(lines[0]);

            while(lineIndentation > indentation) {
                const nextLine = lines.shift()!;
                childLines.push(nextLine);

                lineIndentation = YamlNode.getIndentation(lines[0]);
            }

            if(childLines.length) {
                node.children = YamlNode.fromLines(childLines);
            }

            nodes.push(node);
        }

        return nodes;
    }
}