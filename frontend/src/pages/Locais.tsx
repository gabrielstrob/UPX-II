import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { localService } from '@/services/localService';
import { Local, LocalRequest } from '@/types';
import { MapPin, Plus, Edit2, Trash2, X } from 'lucide-react';
import '../styles/Locais.css';

const Locais: React.FC = () => {
  const { user } = useAuth();
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocal, setEditingLocal] = useState<Local | null>(null);
  const [formData, setFormData] = useState<LocalRequest>({
    usuarioId: user!.id,
    nomeLocal: '',
    endereco: '',
    cep: '',
  });

  useEffect(() => {
    loadLocais();
  }, []);

  const loadLocais = async () => {
    try {
      setLoading(true);
      const data = await localService.getByUsuarioId(user!.id);
      setLocais(data);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLocal) {
        await localService.update(editingLocal.id, formData);
      } else {
        await localService.create(formData);
      }
      await loadLocais();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar local:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este local?')) {
      try {
        await localService.delete(id);
        await loadLocais();
      } catch (error) {
        console.error('Erro ao excluir local:', error);
      }
    }
  };

  const handleEdit = (local: Local) => {
    setEditingLocal(local);
    setFormData({
      usuarioId: local.usuarioId,
      nomeLocal: local.nomeLocal,
      endereco: local.endereco,
      cep: local.cep,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLocal(null);
    setFormData({
      usuarioId: user!.id,
      nomeLocal: '',
      endereco: '',
      cep: '',
    });
  };

  if (loading) {
    return <div className="page-loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Locais</h1>
          <p>Gerencie os locais onde os medidores estão instalados</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Novo Local
        </button>
      </div>

      {locais.length === 0 ? (
        <div className="empty-state card">
          <MapPin size={48} color="#94a3b8" />
          <h3>Nenhum local cadastrado</h3>
          <p>Comece adicionando um novo local</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Adicionar Local
          </button>
        </div>
      ) : (
        <div className="locais-grid">
          {locais.map((local) => (
            <div key={local.id} className="local-card card">
              <div className="local-header">
                <MapPin size={24} color="#0ea5e9" />
                <div className="local-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEdit(local)}
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDelete(local.id)}
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3>{local.nomeLocal}</h3>
              <p className="local-address">{local.endereco}</p>
              <p className="local-cep">CEP: {local.cep}</p>
              <p className="local-date">
                Cadastrado em: {new Date(local.dataCadastro).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLocal ? 'Editar Local' : 'Novo Local'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="nomeLocal" className="label">
                  Nome do Local
                </label>
                <input
                  id="nomeLocal"
                  type="text"
                  className="input"
                  value={formData.nomeLocal}
                  onChange={(e) =>
                    setFormData({ ...formData, nomeLocal: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endereco" className="label">
                  Endereço
                </label>
                <input
                  id="endereco"
                  type="text"
                  className="input"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cep" className="label">
                  CEP
                </label>
                <input
                  id="cep"
                  type="text"
                  className="input"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) =>
                    setFormData({ ...formData, cep: e.target.value })
                  }
                  required
                />
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
                  {editingLocal ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locais;
