import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Região de reserva: centro de São Paulo.
const INICIAL = { latitude: -23.5505, longitude: -46.6333,
 latitudeDelta: 0.03, longitudeDelta: 0.03 };

// Cada ponto tem um id estável e coordenadas numéricas.
const PONTOS = [
 { id: '1', nome: 'Biblioteca', descricao: 'Ponto de leitura',
 latitude: -23.5489, longitude: -46.6388 },
 { id: '2', nome: 'Museu', descricao: 'Visita técnica',
 latitude: -23.5567, longitude: -46.6394 },
];

export default function App() {
  const [regiao, setRegiao] = useState(INICIAL);
  const [localAtual, setLocalAtual] = useState(null);
  const [aviso, setAviso] = useState('Obtendo localização...');

  useEffect(() => {
  let ativo = true; // Evita atualizar após desmontar.
  async function localizar() {
    try {
      const permissao = await Location.requestForegroundPermissionsAsync();
    if (permissao.status !== 'granted') {
    if (ativo) setAviso('Permissão negada. Mapa padrão.');
      return;
    }
  const pos = await Location.getCurrentPositionAsync({});
    if (!ativo) return;
      const coord = { latitude: pos.coords.latitude,
    longitude: pos.coords.longitude };
    setLocalAtual(coord);
    setRegiao({ ...coord, latitudeDelta: 0.02,
    longitudeDelta: 0.02 }); // Centraliza ao obter GPS.
    setAviso('Localização encontrada');
    } catch (erro) {
      if (ativo) setAviso('GPS indisponível. Mapa padrão.');
    }
    }
      localizar();
    return () => { ativo = false; };
    }, []) 

  return (
    <View style={styles.tela}>
    <Text style={styles.aviso}>{aviso}</Text>
    <MapView style={styles.mapa} initialRegion={INICIAL}>
    {localAtual && <Marker coordinate={localAtual}
    title="Você está aqui" pinColor="#55D6C2" />}
    {PONTOS.map((p) => (
    <Marker key={p.id}
    coordinate={{ latitude: p.latitude, longitude: p.longitude }}
    title={p.nome} description={p.descricao} />
    ))}
    </MapView>
    </View>
    );
   }
   const styles = StyleSheet.create({
    tela: { flex: 1 }, mapa: { flex: 1 },
    aviso: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12 },
   });             
   