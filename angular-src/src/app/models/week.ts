export class Week {
    readonly minutesInHour: number = 60;
    readonly standardWeeklyTimeMM: number = 2400;
    readonly standardWeeklyTime: number = this.standardWeeklyTimeMM / this.minutesInHour;

    public weeklyTimeMM: any[];
    public weeklyTimeImagesQCSynthesMM: any[];
    public weeklyTimeImagesQCOblMM: any[];
    public weeklyTimeImagesQCSurgicaseMM: any[];
    public weeklyTimeImagesQCShoulderMM: any[];
    public weeklyTimeImagesQCOtherMM: any[];
    public weeklyTimeCEMM: any[];
    public weeklyTimeQEMM: any[];
    public weeklyTimeOblCEMM: any[];
    public weeklyTimeOblQEMM: any[];
    public totalWeeklyTimeMM: number;
    public weeklyTimeTasksMM: any[];
    constructor() { }

}