import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { localService } from '@/services/localService';
import { medidorService } from '@/services/medidorService';
import { Local, Medidor, MedidorRequest } from '@/types';
import { Activity, Plus, Edit2, Trash2, X } from 'lucide-react';
import '../styles/Locais.css';

const Medidores: React.FC = () => {
  const { user } = useAuth();
  const [medidores, setMedidores] = useState<Medidor[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMedidor, setEditingMedidor] = useState<Medidor | null>(null);
  const [formData, setFormData] = useState<MedidorRequest>({
    localId: 0,
    codigoMedidor: '',
    modelo: '',
    dataInstalacao: '',
    status: 'ATIVO',
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
      setMedidores(medidoresArrays.flat());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedidor) {
        await medidorService.update(editingMedidor.id, formData);
      } else {
        await medidorService.create(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar medidor:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este medidor?')) {
      try {
        await medidorService.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erro ao excluir medidor:', error);
      }
    }
  };

  const handleEdit = (medidor: Medidor) => {
    setEditingMedidor(medidor);
    setFormData({
      localId: medidor.localId,
      codigoMedidor: medidor.codigoMedidor,
      modelo: medidor.modelo,
      dataInstalacao: medidor.dataInstalacao,
      status: medidor.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMedidor(null);
    setFormData({
      localId: locais[0]?.id || 0,
      codigoMedidor: '',
      modelo: '',
      dataInstalacao: '',
      status: 'ATIVO',
    });
  };

  const getLocalNome = (localId: number) => {
    return locais.find((l) => l.id === localId)?.nomeLocal || 'Local não encontrado';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'badge-success';
      case 'INATIVO':
        return 'badge-secondary';
      case 'MANUTENCAO':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return <div className="page-loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Medidores</h1>
          <p>Gerencie os medidores de água dos seus locais</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={locais.length === 0}
        >
          <Plus size={18} />
          Novo Medidor
        </button>
      </div>

      {locais.length === 0 ? (
        <div className="empty-state card">
          <Activity size={48} color="#94a3b8" />
          <h3>Nenhum local cadastrado</h3>
          <p>Cadastre um local antes de adicionar medidores</p>
        </div>
      ) : medidores.length === 0 ? (
        <div className="empty-state card">
          <Activity size={48} color="#94a3b8" />
          <h3>Nenhum medidor cadastrado</h3>
          <p>Comece adicionando um novo medidor</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Adicionar Medidor
          </button>
        </div>
      ) : (
        <div className="locais-grid">
          {medidores.map((medidor) => (
            <div key={medidor.id} className="local-card card">
              <div className="local-header">
                <Activity size={24} color="#0ea5e9" />
                <div className="local-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEdit(medidor)}
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDelete(medidor.id)}
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3>{medidor.codigoMedidor}</h3>
              <p className="local-address">{medidor.modelo}</p>
              <p className="local-cep">Local: {getLocalNome(medidor.localId)}</p>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                <span className={`badge ${getStatusBadgeClass(medidor.status)}`}>
                  {medidor.status}
                </span>
                {medidor.ultimaLeitura && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Última: {medidor.ultimaLeitura.toFixed(2)} m³
                  </span>
                )}
              </div>
              <p className="local-date">
                Instalado em: {new Date(medidor.dataInstalacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMedidor ? 'Editar Medidor' : 'Novo Medidor'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="localId" className="label">
                  Local
                </label>
                <select
                  id="localId"
                  className="input"
                  value={formData.localId}
                  onChange={(e) =>
                    setFormData({ ...formData, localId: Number(e.target.value) })
                  }
                  required
                >
                  <option value="">Selecione um local</option>
                  {locais.map((local) => (
                    <option key={local.id} value={local.id}>
                      {local.nomeLocal}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="codigoMedidor" className="label">
                  Código do Medidor
                </label>
                <input
                  id="codigoMedidor"
                  type="text"
                  className="input"
                  value={formData.codigoMedidor}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoMedidor: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modelo" className="label">
                  Modelo
                </label>
                <input
                  id="modelo"
                  type="text"
                  className="input"
                  value={formData.modelo}
                  onChange={(e) =>
                    setFormData({ ...formData, modelo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dataInstalacao" className="label">
                  Data de Instalação
                </label>
                <input
                  id="dataInstalacao"
                  type="date"
                  className="input"
                  value={formData.dataInstalacao}
                  onChange={(e) =>
                    setFormData({ ...formData, dataInstalacao: e.target.value })
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
                    setFormData({ ...formData, status: e.target.value as 'ATIVO' | 'INATIVO' | 'MANUTENCAO' })
                  }
                  required
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                  <option value="MANUTENCAO">MANUTENÇÃO</option>
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
                  {editingMedidor ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medidores;
