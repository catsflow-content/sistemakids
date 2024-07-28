import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuList, Select } from "@chakra-ui/react";
import { Equals, Eye, EyeSlash, FolderOpen, Funnel, Trash, SealWarning } from "@phosphor-icons/react";
import { cancelDeleteToast } from '../../utils/toast';
import Events from '../../contents/events';

type MaterialGroup = {
  id: number;
  name: string;
  turma: string;
  disabled: boolean;
};

type Alerta = {
  status: 'success' | 'error';
  mensagem: string;
};

export function GroupManagement() {
  const [filterTurma, setFilterTurma] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [materialGroups, setMaterialGroups] = useState<MaterialGroup[]>([]);
  const [showDeleteGroupToast, setShowDeleteGroupToast] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<MaterialGroup | null>(null);
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  const fetchMaterialGroups = async (turma = '', status = '') => {
    try {
      const query = new URLSearchParams({ turma, status }).toString();
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/material/group/search?${query}`);
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
    fetchMaterialGroups(filterTurma, filterStatus);
  }, [filterTurma, filterStatus]);

  const toggleGroupStatus = async (id: number, disabled: boolean) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/material/group/toggle/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disabled: !disabled }),
      });

      if (response.ok) {
        setAlerta({ status: 'success', mensagem: 'Status do grupo atualizado com sucesso!' });
        fetchMaterialGroups();
      } else {
        setAlerta({ status: 'error', mensagem: 'Erro ao atualizar o status do grupo de matérias' });
      }
    } catch (error) {
      setAlerta({ status: 'error', mensagem: 'Erro ao atualizar o status do grupo de matérias' });
      console.error("Erro ao atualizar o status do grupo de matérias:", error);
    }
  };

  const handleGroupTurmaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterTurma(event.target.value);
    fetchMaterialGroups(event.target.value, filterStatus);
  };

  const handleGroupStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
    fetchMaterialGroups(filterTurma, event.target.value);
  };

  const deleteGroup = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/material/group/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlerta({ status: 'success', mensagem: 'Grupo de matérias excluído com sucesso!' });
        fetchMaterialGroups(filterTurma, filterStatus); 
      } else {
        setAlerta({ status: 'error', mensagem: 'Erro ao excluir o grupo de matérias' });
      }
    } catch (error) {
      setAlerta({ status: 'error', mensagem: 'Erro ao excluir o grupo de matérias' });
      console.error("Erro ao excluir o grupo de matérias:", error);
    }
  };

  const handleDeleteGroupConfirm = async () => {
    if (groupToDelete) {
      await deleteGroup(groupToDelete.id);
      setGroupToDelete(null);
      setShowDeleteGroupToast(false);
    }
  };

  const confirmDeleteGroup = (group: MaterialGroup) => {
    setGroupToDelete(group);
    setShowDeleteGroupToast(true);
  };

  const cancelDeleteGroup = () => {
    cancelDeleteToast(setGroupToDelete, setShowDeleteGroupToast);
  };

  return (
    <>
      {/* <RegisterGroup setAlerta={setAlerta} fetchMaterialGroups={fetchMaterialGroups} /> */}
      <section className="_card">
        <div className="_fav">
          <Funnel className="ico" />
        </div>
        <h2>Filtrar grupos</h2>
        <div className="_row">
          <label htmlFor="groupFilterturma" className="_select">
            <Select className="camp" id="groupFilterturma" placeholder="Turma" value={filterTurma} onChange={handleGroupTurmaChange}>
              <option value="Ambas">Ambas</option>
              <option value="Maternal">Maternal</option>
              <option value="Juniores">Juniores</option>
            </Select>
          </label>
          <label htmlFor="groupFilterstatus" className="_select">
            <Select className="camp" id="groupFilterstatus" placeholder="Status" value={filterStatus} onChange={handleGroupStatusChange}>
              <option value="ativado">Ativado</option>
              <option value="desativado">Desativado</option>
            </Select>
          </label>
        </div>
      </section>
      <section className="_card">
        <div className="_fav">
          <FolderOpen className="ico" />
        </div>
        <h2>Gerenciar grupos</h2>
        <div className="_div">
          {materialGroups.length > 0 ? (
            materialGroups.map((group) => (
              <span key={group.id} className="_cnt">
                <p>{group.name} - {group.turma}</p>
                <Menu>
                  <MenuButton as="button" className="_btn rd">
                    <Equals />
                  </MenuButton>
                  <MenuList className="_menu">
                    <MenuItem className="_opt" onClick={() => toggleGroupStatus(group.id, group.disabled)}>
                      {group.disabled ? <EyeSlash /> : <Eye />}
                      {group.disabled ? 'Desativado' : 'Ativado'}
                    </MenuItem>
                    <MenuItem className="_opt" key={group.id} onClick={() => confirmDeleteGroup(group)}>
                      <Trash /> Excluir
                    </MenuItem>
                  </MenuList>
                </Menu>
              </span>
            ))
          ) : (
            <Events mensagem="Ops! Sem grupos de máteria cadastrados." />
          )}
        </div>
      </section>
      {showDeleteGroupToast && groupToDelete && (
        <section className="_toast">
          <section className="_card">
            <div className="_fav">
              <SealWarning className="ico" />
            </div>
            <h2>Excluir grupo?</h2>
            <nav className="_nav">
              <button type="button" title="Cancelar ação" className="_btn center" onClick={cancelDeleteGroup}>Cancelar</button>
              <button type="button" title="Excluir matéria" className="_btn center active" onClick={handleDeleteGroupConfirm}>Excluir</button>
            </nav>
          </section>
        </section>
      )}
    </>
  );
}
