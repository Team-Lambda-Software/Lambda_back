import { Entity } from "src/common/Domain/domain-object/entity.interface"

export class Trainer extends Entity<string>
{
    private firstName: string;
    private firstLastName: string;
    private secondLastName: string; //? This should be optional
    private email: string;
    private phone: string;
    private followersID: Array<string>; //Array of all the users that follow this particular trainer
    private location?:string|undefined; //to-do Refactor as Optional<String>, Optional<LocationClass>
    //to-do Add field for associated courses? Maybe some stats?

    private constructor (id:string, firstName:string, firstLastName:string, secondLastName:string, email:string, phone:string, followersID:Array<string>, location?:string)
    {
        super(id);

        this.firstName = firstName;
        this.firstLastName = firstLastName;
        this.secondLastName = secondLastName;
        this.email = email;
        this.phone = phone;
        this.followersID = followersID;

        this.location = location;
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
        if (this.location === undefined) { throw new ReferenceError("This trainer has no associated location"); }
        return <string>this.location;
    }

    static create (id:string, firstName:string, firstLastName:string, secondLastName:string, email:string, phone:string, followersID:Array<string>, location?:string):Trainer
    {
        return new Trainer(id, firstName, firstLastName, secondLastName, email, phone, followersID, location);
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

    public updateLocation(location?:string):void
    {
        this.location = location;
    }
}