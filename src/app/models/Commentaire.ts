import { Task } from "./Task";
import { User } from "./User";

export class Commentaire {
    public idCommentaire: number;
    public comment: string;
    public dateComment: Date;
    public userCom: User;

    public tacheCom: Task;
    constructor() {
        this.idCommentaire = 0;
        this.comment = '';
        this.dateComment = null;


        this.userCom = {
            id: 0, userId: '', username: '', email: '', telephone: '', professionUser: '',
            lastLoginDate: null, lastLoginDateDisplay: null, joinDate: null, profileImageUrl: '',
            isActive: false, isNotLocked: false, role: '', authorities: []
        };


        this.tacheCom = {
            idTask: 0, nameTask: '', dateCreation: null, dateFin: null, dateModification: null, description: '',
            etatTask: '', taskCreePar: null, memberAffecter: null, sprint: null, archive: false
        };

    }
}