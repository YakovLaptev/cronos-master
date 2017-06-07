/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package facades;

import entities.RaceType;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Анюта
 */
@Stateless
public class RaceTypeFacade extends AbstractFacade<RaceType> {

    @PersistenceContext(unitName = "cronos-ejbPU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public RaceTypeFacade() {
        super(RaceType.class);
    }
    
}
