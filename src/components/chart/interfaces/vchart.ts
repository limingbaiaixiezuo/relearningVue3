

interface UpdateConfig {
    positiveUpdate: boolean;
}

interface Option {
    dataset: MultiLineSet | IntensitySet | SelfDefineEChart;
    xAxis?: object;
    yAxis?: object;
    series?: any[];
}

interface MultiLineSet {
    yAxis: {
        data: Array<Array<number>>;
        name?: string;
    };
    xAxis: {
        data: Array<Array<number>>;
        name?: string;
    };
    seq?: number;
    legend?: {
        data: Array<string>;
    };
    lineInfo?: Array<LineInfo>;
    customRange?: CustomRange;
    scatter?: { 
        symbolSize: number;
        data: Array<Array<number>>;
        type: string;
        name: string;
    };
}

interface IntensitySet {
    data: Array<Array<number>>;
    dx: Array<number>;
    dy: Array<number>;
    yAxis: {
        data: Array<number>;
        name: string;
    };
    xAxis: {
        data: Array<number>;
        name: string;
    };
    equalScale?: boolean;
    meshGrid?: boolean;
    mbMatrix: Array<Array<number>>;
    customRange?: CustomRange;
    title?: {
        text: string;
    };
}

interface SelfDefineEChart {
    source: Array<Array<number | string>>;
}

interface CustomRange {
    isCustomRange: boolean;
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
}

interface LineInfo {
    id: number;
    color: string;
    show: boolean;
    name: string;
}
export default interface VChart {
    dom: HTMLDivElement;
    type: string;
    update: boolean;
    option: Option;
    drawFunc?: string;
    updateConfig?: UpdateConfig;
    opt?: object;
}