import { Entity } from "src/common/Domain/domain-object/entity.interface"

export class Trainer extends Entity<string>
{
    private firstName: string;
    private firstLastName: string;
    private secondLastName: string; //? This should be optional
    private email: string;
    private phone: string;
    private followersID: Array<string>; //Array of all the users that follow this particular trainer
    //unused For easier DDD, the blogs and courses a certain trainer teaches is not part of itself
        //. private coursesID: Array<string>; //Array of all courses that a given trainer teaches
        //. private blogsID: Array<string>; //Array of all courses that a given trainer wrote
    private latitude:string|undefined; //to-do Refactor as Optional<String>, Optional<LocationClass>
    private longitude:string|undefined;
    //to-do Add field for associated courses? Maybe some stats?

    private constructor (id:string, firstName:string, firstLastName:string, secondLastName:string, email:string, phone:string, followersID:Array<string>, latitude?:string, longitude?:string)
    {
        super(id);

        this.firstName = firstName;
        this.firstLastName = firstLastName;
        this.secondLastName = secondLastName;
        this.email = email;
        this.phone = phone;
        this.followersID = followersID;

        this.latitude = latitude;
        this.longitude = longitude;
    }

    get FirstName(): string
    {
        return this.firstName;
    }

    get FirstLastName(): string
    {
        return this.firstLastName;
    }

    get SecondLastName(): string
    {
        return this.secondLastName;
    }

    get Email(): string
    {
        return this.email;
    }

    get Phone(): string
    {
        return this.phone;
    }

    get FollowersID(): Array<string>
    {
        return this.followersID;
    }

    get Location(): string
    {
        if ( (this.latitude === undefined)||(this.longitude === undefined) ) { throw new ReferenceError("This trainer has no associated location"); }
        return <string>this.latitude + " " + <string>this.longitude;
    }

    static create (id:string, firstName:string, firstLastName:string, secondLastName:string, email:string, phone:string, followersID:Array<string>, latitude?:string, longitude?:string):Trainer
    {
        return new Trainer(id, firstName, firstLastName, secondLastName, email, phone, followersID, latitude, longitude);
    }

    public updateFirstName(firstName:string):void
    {
        this.firstName = firstName;
    }

    public updateFirstLastName(firstLastName:string):void
    {
        this.firstName = firstLastName;
    }

    public updateSecondLastName(secondLastName:string):void
    {
        this.firstName = secondLastName;
    }

    public updateEmail(email:string):void
    {
        this.email = email;
    }

    public updatePhone(phone:string):void
    {
        this.phone = phone;
    }

    public addFollower(userID:string):boolean
    {
        if (!(this.followersID.includes(userID))) //User is already following this trainer. Cannot add
        {
            return false;
        }
        else
        {
            this.followersID.push(userID);
            return true;
        }
    }

    public removeFollower(userID:string):boolean
    {
        //to-do Optimize this
        let newFollowerArray:Array<string> = new Array<string>();
        for (let followerID of this.followersID)
        {
            if (followerID != userID) { newFollowerArray.push(followerID); }
        }
        //Check if someone was left out
        if (newFollowerArray.length < this.followersID.length)
        {
            this.followersID = newFollowerArray;
            return true;
        }
        return false;
    }

    public updateLocation(latitude?:string, longitude?:string):void
    {
        if (latitude != undefined) { this.latitude = latitude; }
        if (longitude != undefined) { this.longitude = longitude; }
    }
}