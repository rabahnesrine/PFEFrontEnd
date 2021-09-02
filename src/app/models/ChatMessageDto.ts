export class ChatMessageDto {

    id:string;
    name: string;
    message: string;
    time: string;
    room: string;
  
    // @ts-ignore
    constructor(id:string, name: string, message: string, time:string, room: string) {
      this.id = id;
      this.name = name;
      this.message = message;
      this.time = time;
      this.room = room;
    }
    // @ts-ignore
    constructor(name: string, message: string,room: string) {
      this.name = name;
      this.message = message;
      this.room = room;
    }
  
  }
