import { Agent, WACICredentialOfferSucceded, WACIProtocol } from "@quarkid/agent";
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { FileSystemStorage } from "./storage";

@Injectable()
export class WACIProtocolService {
    agent: Agent;

    constructor(
    //    @Inject(forwardRef(() => Agent)) agent: Agent, // Usar forwardRef para romper la dependencia circular
    ) {
      //  this.agent = agent;
    }

    setCurrentAgent(agent: Agent) {
        this.agent = agent;
    }

    getStorage() {
        return new FileSystemStorage({ filepath: "waci-protocol-ws.json" });
    }

    getWaciProtocol() {
        return new WACIProtocol({
            storage: new FileSystemStorage({ filepath: "waci-protocol-ws.json" }),
            issuer: {
                issuerVerificationRules: async (waciInvitationId: string, holdedDid: string) => {
                    console.log("issuerVerificationRules", waciInvitationId);
                    return {
                        verified: false,
                        rejectMsg: "Problem report test",
                    };
                },
                issueCredentials: async (waciInvitationId: string, holderId: string) => {
                    return new WACICredentialOfferSucceded({
                        credentials: [
                            {
                                credential: {
                                    '@context': [
                                        'https://www.w3.org/2018/credentials/v1',
                                        'https://www.w3.org/2018/credentials/examples/v1',
                                        'https://w3id.org/security/bbs/v1',
                                    ],
                                    id: 'http://example.edu/credentials/58473',
                                    type: ['VerifiableCredential', 'AlumniCredential'],
                                    issuer: this.agent.identity.getOperationalDID().value,
                                    issuanceDate: new Date(),
                                    credentialSubject: {
                                        id: holderId,
                                        givenName: 'María Sofía',
                                       // subject: 'Taller de Tecnologías y producción de Software',
                                       // year: '12/09/2024',
                                        familyName: 'Rached' //Quizas este mal colocarlo aca
                                    },
                                },
                                outputDescriptor: {
                                    id: 'Mi_ba_credential_output',
                                    schema: 'https://schema.org/EducationalOccupationalCredential',
                                    display: {
                                        title: {
                                            text:"Taller de Tecnologías y producción de Software",
                                        },
                                        subtitle: {
                                            text: 'Universidad Nacional de Río Negro',
                                        },
                                        description: {
                                            text: "Se acredita que la alumna cuenta con saberes sobre produccion de software y tecnologías SpringBoot y React.",
                                        },
                                        properties: [{
                                            path: ['$.credentialSubject.givenName'],
                                            fallback: 'Sin nombre',
                                            label: 'Nombre'
                                        },{
                                            path: ['$.credentialSubject.familyName'],
                                            fallback: 'Sin nombre',
                                            label: 'Apellido'
                                        }]
                                    },
                                    styles: {
                                        background: {
                                            color: '#e03314',
                                        },
                                        thumbnail: {
                                            uri: './img/logochico.png',
                                            alt: 'Universidad Nacional de Río Negro',
                                        },
                                        hero: {
                                            uri: 'https://drive.google.com/file/d/1jI_yjvOIVRFRaMbndyGqvwfLx5QIhEG3',
                                            alt: 'uni',
                                        },
                                        text: {
                                            color: '#6B6C89',
                                        },
                                    },
                                }
                            }],
                        issuer: {
                            name: 'Universidad Nacional de Río Negro',
                            styles: {
                                thumbnail: {
                                    uri: 'https://drive.google.com/file/d/1jI_yjvOIVRFRaMbndyGqvwfLx5QIhEG3',
                                    alt: 'Universidad Nacional de Río Negro',
                                },
                                hero: {
                                    uri: 'https://drive.google.com/file/d/1eBxcG5NaC4XQ3fRRIMIZ9SqFsBdLWxxn',
                                    alt: 'uni',
                                },
                                background: {
                                    color: '#e03314',
                                },
                                text: {
                                    color: '#6B6C89',
                                },
                            },
                        },
                        options: {
                            challenge: '508adef4-b8e0-4edf-a53d-a260371c1423',
                            domain: '9rf25a28rs96',
                        },
                    });
                },
            },
        });
    }
}
