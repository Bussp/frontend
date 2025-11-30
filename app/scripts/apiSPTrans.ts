import { busLine } from "../interfaces/busLine";

const apiBaseUrl = "https://api.olhovivo.sptrans.com.br/v2.1";

let auth = false;

export async function loginSPTrans(token: string) {
    const res = await fetch(
        `${apiBaseUrl}/Login/Autenticar?token=${encodeURIComponent(token)}`,
        { 
            method: "POST",
            credentials: "include"
        }
    );

    const ok = await res.json();
    if(ok === true) auth = true;

    return auth;
}

export const buscarLinha = async(termo: string): Promise<busLine[]> => {
    if(!auth) throw new Error("Sem autentitação.");

    const res = await fetch(
        `${apiBaseUrl}/Linha/Buscar?termosBusca=${encodeURIComponent(termo)}`,
        {
            credentials: "include"
        }
    );

    const json: busLine[] = await res.json();
    return json;
}

export async function posicoesOnibus(linha: number) {
    if(!auth) throw new Error("Sem autentitação.");

    const res = await fetch(
        `${apiBaseUrl}/Posicao/Linha?codigoLinha=${linha}`,
        {
            credentials: "include"
        }
    );

    return res.json();
}

export async function pontosOnibus(linha: number) {
    if(!auth) throw new Error("Sem autenticação.");

    const res = await fetch(
        `${apiBaseUrl}/Parada/BuscarParadasPorLinha?codigoLinha=${linha}`,
        {
            credentials: "include"
        }
    );

    return res.json();
}