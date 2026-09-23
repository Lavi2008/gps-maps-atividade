import { useEffect, useState } from 'react';
// Recebe a URL real da API.
export default function usePontosApi(url) {
 const [pontos, setPontos] = useState([]);
 useEffect(() => {
 let ativo = true;
 async function carregar() {
    try {
        const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Falha HTTP');
        const dados = await resposta.json();
    if (!Array.isArray(dados)) throw new Error('Formato inválido');
    if (ativo) setPontos(dados);
} catch (erro) {
    console.warn('Não foi possível carregar pontos:', erro);
    }
    }
    carregar();
        return () => { ativo = false; };
    }, [url]);
    // Aceita números ou coordenadas numéricas em texto.
    return pontos.filter((p) =>
        Number.isFinite(Number(p.latitude)) &&
        Number.isFinite(Number(p.longitude))
    ).map((p) => ({ ...p,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
    }));
}   