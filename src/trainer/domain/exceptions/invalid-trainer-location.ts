import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidTrainerLocationException extends DomainException {
    constructor() { super("Locación inválida. Revise que las coordenadas sean numéricas, latitud esté en el intervalo [-90,90] y longitud [-180,180]") }
}