import { Module } from '@nestjs/common';
import { FirebaseService } from 'Lambda_back/src/firebase.service.ts';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService]  // Exporta el servicio para que pueda ser utilizado en otros módulos
})
export class FirebaseModule {}