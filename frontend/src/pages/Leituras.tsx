import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { localService } from '@/services/localService';
import { medidorService } from '@/services/medidorService';
import { leituraService } from '@/services/leituraService';
import { Local, Medidor, Leitura, LeituraRequest } from '@/types';
import { BarChart3, Plus, Trash2, X, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import '../styles/Locais.css';

const Leituras: React.FC = () => {
  const { user } = useAuth();
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [medidores, setMedidores] = useState<Medidor[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedidor, setSelectedMedidor] = useState<number | null>(null);
  const [formData, setFormData] = useState<LeituraRequest>({
    medidorId: 0,
    valorLeitura: 0,
    fotoLeitura: '',
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
        const leiturasPromises = allMedidores.map((m) =>
          leituraService.getByMedidorId(m.id)
        );
        const leiturasArrays = await Promise.all(leiturasPromises);
        const allLeituras = leiturasArrays.flat();
        setLeituras(allLeituras.sort((a, b) => 
          new Date(b.dataHoraLeitura).getTime() - new Date(a.dataHoraLeitura).getTime()
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
      await leituraService.create(formData);
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao registrar leitura:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir esta leitura?')) {
      try {
        await leituraService.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erro ao excluir leitura:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      medidorId: medidores[0]?.id || 0,
      valorLeitura: 0,
      fotoLeitura: '',
    });
  };

  const getMedidorInfo = (medidorId: number) => {
    const medidor = medidores.find((m) => m.id === medidorId);
    if (!medidor) return 'Desconhecido';
    const local = locais.find((l) => l.id === medidor.localId);
    return `${medidor.codigoMedidor} - ${local?.nomeLocal || 'Local desconhecido'}`;
  };

  const filterLeituras = () => {
    if (selectedMedidor) {
      return leituras.filter((l) => l.medidorId === selectedMedidor);
    }
    return leituras;
  };

  if (loading) {
    return <div className="page-loading">Carregando...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Leituras</h1>
          <p>Histórico de leituras dos medidores</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={medidores.length === 0}
        >
          <Plus size={18} />
          Nova Leitura
        </button>
      </div>

      {medidores.length === 0 ? (
        <div className="empty-state card">
          <BarChart3 size={48} color="#94a3b8" />
          <h3>Nenhum medidor cadastrado</h3>
          <p>Cadastre um medidor antes de registrar leituras</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="filterMedidor" className="label">
              Filtrar por Medidor
            </label>
            <select
              id="filterMedidor"
              className="input"
              value={selectedMedidor || ''}
              onChange={(e) => setSelectedMedidor(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Todos os medidores</option>
              {medidores.map((medidor) => (
                <option key={medidor.id} value={medidor.id}>
                  {getMedidorInfo(medidor.id)}
                </option>
              ))}
            </select>
          </div>

          {filterLeituras().length === 0 ? (
            <div className="empty-state card">
              <Droplets size={48} color="#94a3b8" />
              <h3>Nenhuma leitura registrada</h3>
              <p>Comece adicionando uma nova leitura</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus size={18} />
                Registrar Leitura
              </button>
            </div>
          ) : (
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Medidor</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Valor (m³)</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Data/Hora</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Foto</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterLeituras().map((leitura) => (
                      <tr key={leitura.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--spacing-md)' }}>{getMedidorInfo(leitura.medidorId)}</td>
                        <td style={{ padding: 'var(--spacing-md)', fontWeight: 600 }}>
                          {leitura.valorLeitura.toFixed(2)}
                        </td>
                        <td style={{ padding: 'var(--spacing-md)' }}>
                          {format(new Date(leitura.dataHoraLeitura), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td style={{ padding: 'var(--spacing-md)' }}>
                          {leitura.fotoLeitura ? (
                            <a href={leitura.fotoLeitura} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                              Ver foto
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)' }}>Sem foto</span>
                          )}
                        </td>
                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => handleDelete(leitura.id)}
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Leitura</h2>
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
                <label htmlFor="valorLeitura" className="label">
                  Valor da Leitura (m³)
                </label>
                <input
                  id="valorLeitura"
                  type="number"
                  step="0.001"
                  className="input"
                  value={formData.valorLeitura}
                  onChange={(e) =>
                    setFormData({ ...formData, valorLeitura: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="fotoLeitura" className="label">
                  URL da Foto (opcional)
                </label>
                <input
                  id="fotoLeitura"
                  type="url"
                  className="input"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={formData.fotoLeitura}
                  onChange={(e) =>
                    setFormData({ ...formData, fotoLeitura: e.target.value })
                  }
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
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leituras;
