import IDataModel from "../framework/model/IDataModel";

export default class RoomChoseModel extends IDataModel {
    public room1_type: number = 2;          //1:等待，2:进行中
    public room2_type: number = 2;
    public room3_type: number = 2;
    public room1_min: number = 0;
    public room1_max: number = 30;
    public room2_min: number = 0;
    public room2_max: number = 30;
    public room3_min: number = 0;
    public room3_max: number = 30;

    constructor() {
        super('roomChose');
    }

    initData(list: any[]){
        var room1 = list[0];
        var room2 = list[1];
        var room3 = list[2];

        this.room1_type = room1?.status;
        this.room1_min = room1?.num;
        this.room1_max = room1?.total;
        this.room2_type = room2?.status;
        this.room2_min = room2?.num;
        this.room2_max = room2?.total;
        this.room3_type = room3?.status;
        this.room3_min = room3?.num;
        this.room3_max = room3?.total;
    }
}