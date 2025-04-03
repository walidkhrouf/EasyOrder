package com.esprit.easyorder.gestionmenus.repositories;

import com.esprit.easyorder.gestionmenus.entities.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
}