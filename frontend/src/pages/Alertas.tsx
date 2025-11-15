import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { localService } from '@/services/localService';
import { medidorService } from '@/services/medidorService';
import { alertaService } from '@/services/alertaService';
import { Local, Medidor, Alerta, AlertaRequest } from '@/types';
import { Bell, Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import '../styles/Locais.css';

const Alertas: React.FC = () => {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [medidores, setMedidores] = useState<Medidor[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAlerta, setEditingAlerta] = useState<Alerta | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [formData, setFormData] = useState<AlertaRequest>({
    medidorId: 0,
    tipoAlerta: 'CONSUMO_ALTO',
    descricao: '',
    status: 'PENDENTE',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const locaisData = await localService.getByUsuarioId(user!.id);
      setLocais(locaisData);

      const medidoresPromises = locaisData.map((local) =>
        medidorService.getByLocalId(local.id)
      );
      const medidoresArrays = await Promise.all(medidoresPromises);
      const allMedidores = medidoresArrays.flat();
      setMedidores(allMedidores);

      if (allMedidores.length > 0) {
        const alertasPromises = allMedidores.map((m) =>
          alertaService.getByMedidorId(m.id)
        );
        const alertasArrays = await Promise.all(alertasPromises);
        const allAlertas = alertasArrays.flat();
        setAlertas(allAlertas.sort((a, b) => 
          new Date(b.dataHoraCriacao).getTime() - new Date(a.dataHoraCriacao).getTime()
        ));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAlerta) {
        await alertaService.update(editingAlerta.id, formData);
      } else {
        await alertaService.create(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar alerta:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este alerta?')) {
      try {
        await alertaService.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erro ao excluir alerta:', error);
      }
    }
  };

  const handleEdit = (alerta: Alerta) => {
    setEditingAlerta(alerta);
    setFormData({
      medidorId: alerta.medidorId,
      tipoAlerta: alerta.tipoAlerta,
      descricao: alerta.descricao,
      status: alerta.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAlerta(null);
    setFormData({
      medidorId: medidores[0]?.id || 0,
      tipoAlerta: 'CONSUMO_ALTO',
      descricao: '',
      status: 'PENDENTE',
    });
  };

  const getMedidorInfo = (medidorId: number) => {
    const medidor = medidores.find((m) => m.id === medidorId);
    if (!medidor) return 'Desconhecido';
    const local = locais.find((l) => l.id === medidor.localId);
    return `${medidor.codigoMedidor} - ${local?.nomeLocal || 'Local desconhecido'}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'badge-warning';
      case 'EM_ANALISE':
        return 'badge-info';
      case 'RESOLVIDO':
        return 'badge-success';
      case 'IGNORADO':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  const getTipoAlertaColor = (tipo: string) => {
    switch (tipo) {
      case 'CONSUMO_ALTO':
        return '#f59e0b';
      case 'VAZAMENTO':
        return '#ef4444';
      case 'MEDIDOR_INATIVO':
        return '#94a3b8';
      default:
        return '#3b82f6';
    }
  };

  const filterAlertas = () => {
    if (filterStatus) {
      return alertas.filter((a) => a.status === filterStatus);
    }
    return alertas;
  };

  if (loading) {
    return <div className="page-loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Alertas</h1>
          <p>Gerencie os alertas dos medidores</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={medidores.length === 0}
        >
          <Plus size={18} />
          Novo Alerta
        </button>
      </div>

      {medidores.length === 0 ? (
        <div className="empty-state card">
          <Bell size={48} color="#94a3b8" />
          <h3>Nenhum medidor cadastrado</h3>
          <p>Cadastre um medidor antes de criar alertas</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="filterStatus" className="label">
              Filtrar por Status
            </label>
            <select
              id="filterStatus"
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="EM_ANALISE">EM ANÁLISE</option>
              <option value="RESOLVIDO">RESOLVIDO</option>
              <option value="IGNORADO">IGNORADO</option>
            </select>
          </div>

          {filterAlertas().length === 0 ? (
            <div className="empty-state card">
              <AlertTriangle size={48} color="#94a3b8" />
              <h3>Nenhum alerta encontrado</h3>
              <p>Nenhum alerta corresponde aos filtros selecionados</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {filterAlertas().map((alerta) => (
                <div key={alerta.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                      <AlertTriangle size={24} color={getTipoAlertaColor(alerta.tipoAlerta)} />
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                          {alerta.tipoAlerta.replace(/_/g, ' ')}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {getMedidorInfo(alerta.medidorId)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
                      <span className={`badge ${getStatusBadgeClass(alerta.status)}`}>
                        {alerta.status.replace(/_/g, ' ')}
                      </span>
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(alerta)}
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(alerta.id)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
                    {alerta.descricao}
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '0.75rem', color: 'var(--text-tertiary)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border)' }}>
                    <span>
                      Criado em: {format(new Date(alerta.dataHoraCriacao), 'dd/MM/yyyy HH:mm')}
                    </span>
                    {alerta.dataHoraResolucao && (
                      <span>
                        Resolvido em: {format(new Date(alerta.dataHoraResolucao), 'dd/MM/yyyy HH:mm')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAlerta ? 'Editar Alerta' : 'Novo Alerta'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="medidorId" className="label">
                  Medidor
                </label>
                <select
                  id="medidorId"
                  className="input"
                  value={formData.medidorId}
                  onChange={(e) =>
                    setFormData({ ...formData, medidorId: Number(e.target.value) })
                  }
                  required
                >
                  <option value="">Selecione um medidor</option>
                  {medidores.map((medidor) => (
                    <option key={medidor.id} value={medidor.id}>
                      {getMedidorInfo(medidor.id)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="tipoAlerta" className="label">
                  Tipo de Alerta
                </label>
                <select
                  id="tipoAlerta"
                  className="input"
                  value={formData.tipoAlerta}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoAlerta: e.target.value as any })
                  }
                  required
                >
                  <option value="CONSUMO_ALTO">CONSUMO ALTO</option>
                  <option value="VAZAMENTO">VAZAMENTO</option>
                  <option value="MEDIDOR_INATIVO">MEDIDOR INATIVO</option>
                  <option value="OUTRO">OUTRO</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="descricao" className="label">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  className="input"
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select
                  id="status"
                  className="input"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  required
                >
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="EM_ANALISE">EM ANÁLISE</option>
                  <option value="RESOLVIDO">RESOLVIDO</option>
                  <option value="IGNORADO">IGNORADO</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAlerta ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alertas;
