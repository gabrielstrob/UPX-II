import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { localService } from '@/services/localService';
import { medidorService } from '@/services/medidorService';
import { leituraService } from '@/services/leituraService';
import { alertaService } from '@/services/alertaService';
import { Local, Medidor, Leitura, Alerta } from '@/types';
import { 
  Droplets, 
  MapPin, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [locais, setLocais] = useState<Local[]>([]);
  const [medidores, setMedidores] = useState<Medidor[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Busca locais do usuário
      const locaisData = await localService.getByUsuarioId(user!.id);
      setLocais(locaisData);
      
      // Busca todos os medidores dos locais
      const medidoresPromises = locaisData.map(local => 
        medidorService.getByLocalId(local.id)
      );
      const medidoresArrays = await Promise.all(medidoresPromises);
      const allMedidores = medidoresArrays.flat();
      setMedidores(allMedidores);
      
      // Busca alertas e leituras de todos os medidores
      if (allMedidores.length > 0) {
        const alertasPromises = allMedidores.map(m => alertaService.getByMedidorId(m.id));
        const leiturasPromises = allMedidores.map(m => leituraService.getByMedidorId(m.id));
        
        const alertasArrays = await Promise.all(alertasPromises);
        const leiturasArrays = await Promise.all(leiturasPromises);
        
        const allAlertas = alertasArrays.flat();
        const allLeituras = leiturasArrays.flat();
        
        setAlertas(allAlertas.filter(a => a.status === 'PENDENTE'));
        setLeituras(allLeituras);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularConsumoTotal = () => {
    if (leituras.length === 0) return 0;
    return leituras.reduce((sum, l) => sum + l.valorLeitura, 0);
  };

  const calcularConsumoMedio = () => {
    if (leituras.length === 0) return 0;
    return calcularConsumoTotal() / leituras.length;
  };

  const getChartData = () => {
    return leituras
      .slice(-10)
      .map(l => ({
        data: new Date(l.dataHoraLeitura).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        valor: l.valorLeitura
      }));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Droplets className="loading-icon" size={48} />
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user?.nome}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <MapPin size={24} color="#1e40af" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Locais</p>
            <p className="stat-value">{locais.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>
            <Activity size={24} color="#166534" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Medidores Ativos</p>
            <p className="stat-value">{medidores.filter(m => m.status === 'ATIVO').length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <AlertTriangle size={24} color="#92400e" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Alertas Pendentes</p>
            <p className="stat-value">{alertas.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Droplets size={24} color="#3730a3" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Consumo Total</p>
            <p className="stat-value">{calcularConsumoTotal().toFixed(2)} m³</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card card">
          <h2>Histórico de Consumo</h2>
          {leituras.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <p>Nenhuma leitura registrada</p>
            </div>
          )}
        </div>

        <div className="alerts-card card">
          <h2>Alertas Recentes</h2>
          {alertas.length > 0 ? (
            <div className="alerts-list">
              {alertas.slice(0, 5).map(alerta => (
                <div key={alerta.id} className="alert-item">
                  <AlertTriangle size={18} color="#f59e0b" />
                  <div className="alert-info">
                    <p className="alert-type">{alerta.tipoAlerta.replace(/_/g, ' ')}</p>
                    <p className="alert-desc">{alerta.descricao}</p>
                  </div>
                  <span className="badge badge-warning">{alerta.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhum alerta pendente</p>
            </div>
          )}
        </div>
      </div>

      <div className="medidores-overview card">
        <h2>Medidores</h2>
        {medidores.length > 0 ? (
          <div className="medidores-grid">
            {medidores.map(medidor => {
              const local = locais.find(l => l.id === medidor.localId);
              return (
                <div key={medidor.id} className="medidor-card">
                  <div className="medidor-header">
                    <Activity size={20} />
                    <span className={`badge badge-${medidor.status === 'ATIVO' ? 'success' : 'secondary'}`}>
                      {medidor.status}
                    </span>
                  </div>
                  <h3>{medidor.codigoMedidor}</h3>
                  <p className="medidor-local">{local?.nomeLocal}</p>
                  <p className="medidor-model">{medidor.modelo}</p>
                  {medidor.ultimaLeitura && (
                    <div className="medidor-reading">
                      <Droplets size={16} />
                      <span>{medidor.ultimaLeitura.toFixed(2)} m³</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhum medidor cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
