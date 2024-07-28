// MaterialManagement.tsx
import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuList, Select } from "@chakra-ui/react";
import { ArticleNyTimes, Equals, Eye, EyeSlash, Funnel, Trash, SealWarning } from "@phosphor-icons/react";
import { cancelDeleteToast } from '../../utils/toast';
import Events from '../../contents/events';

type MaterialGroup = {
  id: number;
  name: string;
  turma: string;
  disabled: boolean;
};

type Material = {
  id: number;
  name: string;
  description: string;
  group: string;
  turma: string;
  disabled: boolean;
};

export function MaterialManagement() {
  const [filterTurma, setFilterTurma] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialGroups, setMaterialGroups] = useState<MaterialGroup[]>([]);
  const [showDeleteMaterialToast, setShowDeleteMaterialToast] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [alerta, setAlerta] = useState<{ status: string, mensagem: string } | null>(null);

  const fetchMaterials = async (turma = '', status = '', group = '') => {
    try {
      const query = new URLSearchParams({ turma, status, grupo: group }).toString();
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/material/search?${query}`);
      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      } else {
        console.error("Erro ao buscar matérias");
      }
    } catch (error) {
      console.error("Erro ao buscar matérias:", error);
    }
  };

  const fetchMaterialGroups = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/material/group/search`);
      if (response.ok) {
        const data = await response.json();
        setMaterialGroups(data);
      } else {
        console.error("Erro ao buscar grupos de matérias");
      }
    } catch (error) {
      console.error("Erro ao buscar grupos de matérias:", error);
    }
  };

  useEffect(() => {
    fetchMaterialGroups();
  }, []);

  useEffect(() => {
    fetchMaterials(filterTurma, filterStatus, filterGroup);
  }, [filterTurma, filterStatus, filterGroup]);

  const toggleMaterialStatus = async (id: number, disabled: boolean) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/material/toggle/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disabled: !disabled }),
      });

      if (response.ok) {
        setAlerta({ status: 'success', mensagem: 'Status da matéria atualizado com sucesso!' });
        fetchMaterials(filterTurma, filterStatus, filterGroup);
      } else {
        setAlerta({ status: 'error', mensagem: 'Erro ao atualizar o status da matéria' });
      }
    } catch (error) {
      setAlerta({ status: 'error', mensagem: 'Erro ao atualizar o status da matéria' });
      console.error("Erro ao atualizar o status da matéria:", error);
    }
  };

  const handleMaterialTurmaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterTurma(event.target.value);
    fetchMaterials(event.target.value, filterStatus, filterGroup);
  };

  const handleMaterialStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
    fetchMaterials(filterTurma, event.target.value, filterGroup);
  };

  const handleMaterialGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterGroup(event.target.value);
    fetchMaterials(filterTurma, filterStatus, event.target.value);
  };

  const deleteMaterial = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/material/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlerta({ status: 'success', mensagem: 'Matéria excluída com sucesso!' });
        fetchMaterials(filterTurma, filterStatus, filterGroup); // Atualiza a lista de matérias
      } else {
        setAlerta({ status: 'error', mensagem: 'Erro ao excluir a matéria' });
      }
    } catch (error) {
      setAlerta({ status: 'error', mensagem: 'Erro ao excluir a matéria' });
      console.error("Erro ao excluir a matéria:", error);
    }
  };

  const handleDeleteMaterialConfirm = async () => {
    if (materialToDelete) {
      await deleteMaterial(materialToDelete.id);
      setMaterialToDelete(null);
      setShowDeleteMaterialToast(false);
    }
  };

  const confirmDeleteMaterial = (material: Material) => {
    setMaterialToDelete(material);
    setShowDeleteMaterialToast(true);
  };

  const cancelDeleteMaterial = () => {
    cancelDeleteToast(setMaterialToDelete, setShowDeleteMaterialToast);
  };

  return (
    <>
      {/* <RegisterMaterias setAlerta={setAlerta} fetchMaterials={fetchMaterials} /> */}
      <section className="_card">
        <div className="_fav">
          <Funnel className="ico" />
        </div>
        <h2>Filtrar matérias</h2>
        <div className="_div">
          <div className="_row">
            <label htmlFor="materialFilterturma" className="_select">
              <Select className="camp" id="materialFilterturma" placeholder="Turma" value={filterTurma} onChange={handleMaterialTurmaChange}>
                <option value="Ambas">Ambas</option>
                <option value="Maternal">Maternal</option>
                <option value="Juniores">Juniores</option>
              </Select>
            </label>
            <label htmlFor="materialFilterstatus" className="_select">
              <Select className="camp" id="materialFilterstatus" placeholder="Status" value={filterStatus} onChange={handleMaterialStatusChange}>
                <option value="ativado">Ativado</option>
                <option value="desativado">Desativado</option>
              </Select>
            </label>
          </div>
          <label htmlFor="materialFiltergroup" className="_select">
            <Select className="camp" id="materialFiltergroup" placeholder="Selecionar grupo" value={filterGroup} onChange={handleMaterialGroupChange}>
              {materialGroups.map((group) => (
                <option key={group.id} value={group.name}>{group.name}</option>
              ))}
            </Select>
          </label>
        </div>
      </section>
      <section className="_card">
        <div className="_fav">
          <ArticleNyTimes className="ico" />
        </div>
        <h2>Gerenciar matérias</h2>
        <div className="_div">
          {materials.length > 0 ? (
            materials.map((material) => (
              <span key={material.id} className="_cnt">
                <p>{material.name}</p>
                <Menu>
                  <MenuButton as="button" className="_btn rd">
                    <Equals />
                  </MenuButton>
                  <MenuList className="_menu">
                    <MenuItem className="_opt" onClick={() => toggleMaterialStatus(material.id, material.disabled)}>
                      {material.disabled ? <EyeSlash /> : <Eye />}
                      {material.disabled ? 'Desativado' : 'Ativado'}
                    </MenuItem>
                    <MenuItem className="_opt" key={material.id} onClick={() => confirmDeleteMaterial(material)}>
                      <Trash /> Excluir
                    </MenuItem>
                  </MenuList>
                </Menu>
              </span>
            ))
          ) : (
            <Events mensagem="Ops! Sem matérias cadastradas." />
          )}
        </div>
      </section>
      {showDeleteMaterialToast && materialToDelete && (
        <section className="_toast">
          <section className="_card">
            <div className="_fav">
              <SealWarning className="ico" />
            </div>
            <h2>Excluir matérias?</h2>
            <nav className="_nav">
              <button type="button" title="Cancelar ação" className="_btn center" onClick={cancelDeleteMaterial}>Cancelar</button>
              <button type="button" title="Excluir matéria" className="_btn center active" onClick={handleDeleteMaterialConfirm}>Excluir</button>
            </nav>
          </section>
        </section>
      )}
    </>
  );
}
