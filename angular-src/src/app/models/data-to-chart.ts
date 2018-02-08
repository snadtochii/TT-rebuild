export interface DataToChart{
    data: ChartData[];
    date: Date;
    labels: string[];
    options: any;
    type: string;
}
export interface ChartData {
    data: number[];
    label: string;
}