/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package websocket;

import entities.Mark;
import entities.MarkComparator;
import entities.Race;
import entities.RaceResult;
import facades.RaceFacade;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.ejb.Stateful;
import javax.inject.Inject;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.codehaus.jackson.map.ObjectMapper;

/**
 *
 * @author Анюта
 */
@ServerEndpoint(value = "/ResultBroadcast")
@Stateful
public class ResultBroadcast {

    @Inject
    private RaceFacade raceFac;
    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());
    private List<Mark> resultList = new ArrayList<Mark>();
    private Boolean raceIsOn = false;
    private static List<Mark> currentHistory = new ArrayList<Mark>();

    public List<Mark> getResultList() {
        return resultList;
    }

    public void readFromFile() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        //ShootMarkContainer shootMarkContainer = (ShootMarkContainer) mapper.readValue(new FileInputStream("C:\\Users\\Azzaz\\Рабочий стол\\курсовик джава\\cronos-2-master\\cronos-war\\web\\shooting.json"), ShootMarkContainer.class);
        //LapMarkContainer lapMarkContainer = (LapMarkContainer) mapper.readValue(new FileInputStream("C:\\Users\\Azzaz\\Рабочий стол\\курсовик джава\\cronos-2-master\\cronos-war\\web\\laps.json"), LapMarkContainer.class);
        ShootMarkContainer shootMarkContainer = (ShootMarkContainer) mapper.readValue(new FileInputStream("C:\\Users\\Анюта\\Desktop\\Универ\\6 СЕМЕСТР\\РПС\\cronos-master\\cronos-master\\cronos-war\\web\\shooting.json"), ShootMarkContainer.class);
        LapMarkContainer lapMarkContainer = (LapMarkContainer) mapper.readValue(new FileInputStream("C:\\Users\\Анюта\\Desktop\\Универ\\6 СЕМЕСТР\\РПС\\cronos-master\\cronos-master\\cronos-war\\web\\laps.json"), LapMarkContainer.class);
        resultList.addAll(shootMarkContainer.getMarks());
        resultList.addAll(lapMarkContainer.getMarks());
        Collections.sort(resultList, new MarkComparator());
    }

    @OnMessage
    public void broadcastResult(String message, Session session) throws InterruptedException, IOException, EncodeException {
        Set resultsSet = new HashSet();

        if ("start".equals(message)) {

            readFromFile();
            if (raceIsOn) {
                session.getBasicRemote().sendText("{errorMessage:\"Race is already on\"}");
                return;
            }
            raceIsOn = true;
            Long now = 0L;
            resultList.get(resultList.size() - 1).setStartOrEnd(Boolean.FALSE);
            for (Mark m : resultList) {
                System.out.println("broadcastFigure: " + m.toString());
                Thread.sleep(m.getMarkTime() - now);
                for (Session peer : peers) {
                    peer.getBasicRemote().sendText(m.toJson());
                }
                now = m.getMarkTime();
                currentHistory.add(m);
                resultsSet.add(m.getRaceResult());
                for (Object o : resultsSet) {
                    RaceResult rr = (RaceResult) o;
                    if (rr.getId() == m.getRaceResult().getId()) {
                        rr.getRaceResults().add(m);
                    }
                }

            }
            for (Object o : resultsSet) {
                RaceResult rr = (RaceResult) o;
                rr.setId(null);
                Race r = raceFac.find(rr.getRace().getId());
                r.getRaceResults().add(rr);
                raceFac.edit(r);

            }
            raceIsOn = false;
            currentHistory.clear();
            System.out.println("end of race");
        }

    }

    @OnOpen
    public void onOpen(Session peer) throws IOException, EncodeException {
        peers.add(peer);
        for (Mark m : currentHistory) {
            peer.getBasicRemote().sendText(m.toJson());

        }

    }

    @OnClose
    public void onClose(Session peer) {
        peers.remove(peer);
    }

}
