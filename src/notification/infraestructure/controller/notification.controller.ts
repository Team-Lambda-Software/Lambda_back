import { Body, Controller, Inject } from "@nestjs/common";
import { Get, Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { SaveTokenDto } from "../dto/entry/save-token.infraestructure.dto";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { GoodDayNotifier } from "../notifier/good-day-notifier";
import * as admin from 'firebase-admin';
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { OrmNotificationAddressRepository } from "../repositories/orm-notification-repository";
import { DataSource } from "typeorm";
import { INotificationAddressRepository } from "src/notification/domain/repositories/notification-address-repository.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { NotificationAddress } from "src/notification/domain/entities/notification-address";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository";
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository";
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper";
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper";
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper";
import { randomInt } from "crypto";
import { RecommendCourseNotifier } from "../notifier/recommend-course-notifier";
import { Course } from "src/course/domain/course";
import { Result } from "src/common/Application/result-handler/Result";
import { GetNotificationsUserDto } from "../dto/entry/get-notifications-user.infraestructure.dto copy";
import { WelcomeNotifier } from "../notifier/welcome-notifier";

const credentials:object = {
    type: "service_account",
    project_id: "myawe-91958",
    private_key_id: "cdd2a0da10bd579f3b4052cbad71ca0140d91d7d",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCSs35f3hHNKTb4\nNZO6lOfMrH864dAgRF54TD/QkxnUMde+u2sJbhypD29oa3nUngeMF5zsnkHFNrBs\n/DSLsAlHl1C4gJArbvvADeopWSBylhhZHsot995V0UyFgpDfjL8fSt08So0aGPD2\nOtGZKZlEDBby4TCTWMPgsI78NaQUP2YY2dbmIkQRlfXKfMoEVJX+Pj6OysGDL1TY\nnwItMX9cDDCAU2acNlabOKNtrSvssISr4FF+qxec7WX/I/1PcNrHsWbrUzDfZUqo\n5Ndmr97EY8QF4OoREa87HcLd23hZ33Y56tsoqZgMBxI+pXQzgcAh25PZxRj/gMcn\ndrkYhS3BAgMBAAECggEABGdWAygjGRlIR6xRzNZdxJEOZQrQktnjizVYfm0Of8Yu\n4IhPJ9Rn4McsXi5I/Qnw/n6KVtffr/0er9hUplduiWEmZqHxFfUwAl92jqcAymDF\nHoZ+HaHy0RkaNLknCrdemLiYTlgrbvfGArGwf1JKYgqR/Sinauplj5z0L1fnvuXu\nSLvgSfTeEzOP9seYtYFbE0ERyB/2uAyQw4eYKAvgkeuyNkeh0nxV76tpReHfB55L\nlMn9BFY0/RCpjzrkzPsR9VeggBJngqQsiZ4IGC3+n2DaK5pG48VqwA93awaO/KM7\nwDe7skpOqAnbmFVtKq8aGxJ0+R65NnnfxGaNAmAKoQKBgQDJVIeKNNPXeiYzOwNt\nwG+kEDJiUDPG0fEZAltF/xANNsuwHmHSYgV5WeELrBGlCGGHFXt34hmT28/+XXoW\nYlOJtOvo2ON9zKe+/YMgGh+anJrUJtYNp5jEiPpTihD/Tkwj8Q3Dlk6+oyDePW4S\nVmvXnAeIeZ8b3oclSH5uMePXoQKBgQC6iWzrj56FwzP15oru74SGfoTwxoazcfWc\nDxWTfQ2wEHhMG0FUpOA/V929GxCFJg31Bky8hJ2sApUitbKJDPCPb8+DNevJdzdv\nzvJY05bNbvbvbghLxpOBSEEl0E2G9rv9LsM/jxGSxiFwaZfXGGbMa7aKO6iEfmZ/\nhqTsnKMiIQKBgQDC+i8NpN2oJ67JHJTUfHJiNCFnXv7VxMo2izaz0jHMak3XMYVR\nBwcAIBA3ipvH9RbmiOJ7Fqforw9+6y5qcS0wBtwVM78VPNcTu1Z7B3Gl/ZZgcYAJ\n1062v2WW8/ZEGqLYiAHpci6upzMUp+9qqPFl7MDK5eY2Sksdy1hOBdj/IQKBgQCn\n16nK1yKDJ15knzlZvuiW/9Zss6VWZ27hKe13FSmwx1EG4etJ10TzmgMp+eVGeTRL\nyYxYgFdDA9vfLHBlwt/doHSukmEDmSKnlyUW6eQiGvtT+sS6MgZdaH8+IAzyKKaE\nLISAdyIP1/kUpd57KzisLStFfGKoPPfLPYK+aD6dIQKBgQC5ZLAitAMsUhgiWqZQ\nJDsAcwlM8zZ5JbQluC8yNo6PEu6o1JKlu47nrNMNUNFE9vER6vVIcW87rHc6KQZ9\n9wSqak8Qwnl22H1yXMUMIa/iJoVkxIsjpqqnHRabzB6uN5Vy6VinY/Wukdpp2dJW\neAVjCy4AWeIe6D+8hoBL3nhIaA==\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-6p01o@myawe-91958.iam.gserviceaccount.com",
    client_id: "106988493002814302645",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6p01o%40myawe-91958.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
}

admin.initializeApp({ credential: admin.credential.cert(credentials) })

@Controller('notification')
export class NotificationController {
 
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly userRepository: IUserRepository
    private readonly courseRepository: ICourseRepository
    private readonly uuidGenerator: IdGenerator<string>

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
    ) {
        this.notiAddressRepository = new OrmNotificationAddressRepository( dataSource )
        this.uuidGenerator = new UuidGenerator()
        this.userRepository = new OrmUserRepository( new OrmUserMapper() , dataSource )
        this.courseRepository = new OrmCourseRepository( 
            new OrmCourseMapper( new OrmSectionMapper() ),
            new OrmSectionMapper(),
            new OrmSectionCommentMapper(),
            dataSource
        )
    }
    
    // CRON 24 HORAS
    @Get('goodday')  
    async goodDayNotification() {
        const findResult = await this.notiAddressRepository.findAllTokens()
        const goodDayNotifier = new GoodDayNotifier()
        //if ( !findResult.isSuccess() ) return { message: 'Sin tokens registrados', errorCode: 500 }
        if ( findResult.isSuccess() ) {
            const listTokens = findResult.Value
            listTokens.forEach( async e => {  
                try {
                    const result = await goodDayNotifier.sendNotification( { token: e.Token } )
                } catch (e) {}
            })
        }
    }

    // CRON 24 HORA
    @Get('recommend')
    async recommendCoursesRandomNotification() {

        const findResultTokens = await this.notiAddressRepository.findAllTokens()
        //if ( !findResultTokens.isSuccess() ) return { message: 'Sin tokens registrados', errorCode: 500 }
        const findResultCourses = await this.courseRepository.findCoursesByName(' ', { limit: 10, offset: 0 })
        //if ( !findResultCourses.isSuccess() ) return { message: 'Sin cursos registrados', errorCode: 500 }
        const recommendCourse = new RecommendCourseNotifier()
        
        if ( findResultCourses.isSuccess && findResultTokens.isSuccess ) {

            const listTokens = findResultTokens.Value
            const listCourses = findResultCourses.Value
            var ran = randomInt(0, listCourses.length)
            const course = listCourses[ran]
        
            recommendCourse.setVariable(course)
            
            listTokens.forEach( async e => {
                try {
                    const result = await recommendCourse.sendNotification( { token: e.Token } )
                } catch (e) {}
            })
        }

    }

    @Post('savetoken')
    async saveToken(@Body() saveTokenDto: SaveTokenDto) {
        const findResult = await this.userRepository.findUserByEmail(saveTokenDto.email)
        if ( !findResult.isSuccess() ) return { message: 'Email no registrado', errorCode: 500 }
        const saveResult = await this.notiAddressRepository.saveNotificationAddress(
            NotificationAddress.create(
                await this.uuidGenerator.generateId(),
                findResult.Value.Id,
                saveTokenDto.token
            )
        )    
        if ( !saveResult.isSuccess() ) return { message: 'Error al registrar token', errorCode: 500 }

        const welcomeNotifier = new WelcomeNotifier()
        welcomeNotifier.setVariable( findResult.Value.FirstName )
        const result = await welcomeNotifier.sendNotification( { token: saveTokenDto.token } )

        if ( !result.isSuccess() ) console.log('token invalido')

        return { message: 'Guardado de token exitoso', errorCode: 200 }
    }


    @Post('getnotificationsuser')
    async getNotificationsUser(@Body() getNotiDto: GetNotificationsUserDto) {
        const findResult = await this.userRepository.findUserByEmail(getNotiDto.email)
        if ( !findResult.isSuccess() ) return { message: 'Email no registrado', errorCode: 500 }
        return Result.success(findResult.Value, 200)
    }


}