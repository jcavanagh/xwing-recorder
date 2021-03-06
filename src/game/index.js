import React, { useContext, useState } from 'react';
import get from 'lodash/get';

import { Button, Col, Container, Form, InputGroup, Modal, Navbar, Row, Spinner, Media } from 'react-bootstrap';

import { importYASB, importXWS } from '../app/import';
import { AppContext } from '../app/state';
import data from '../data';
import { XWSTooltip } from '../squad';
import { UserImage } from '../user';

function GameStatus() {
  // Player names + factions, time left, total points destroyed, etc
  return <Row />;
}

// function SquadPanel() {}

// function PlanningPhasePanel() {}

// function SystemPhasePanel() {}

// function ActivationPhasePanel() {}

// function EngagementPhasePanel() {}

function InGamePanel() {
  return <GameStatus />;
}

function SquadImportModal({ game }) {
  const state = useContext(AppContext);
  const user = state.user?.value;

  const squad = game.players[user.uid].squad;
  const squadMsg = squad ? 'Edit Squad' : 'Import Squad';

  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Form state
  const [yasb, setYasb] = useState();
  const [xws, setXws] = useState();

  const handleImport = async type => {
    let squad;
    try {
      if (type === 'xws') {
        squad = await importXWS(xws);
      } else if (type === 'yasb') {
        squad = await importYASB(yasb);
      }
    } catch (e) {
      //TODO: Import error UX
      console.error(e);
    }

    if (squad) {
      state.games.updateSquad(game.id, squad.xws);
      handleClose();
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {squadMsg}
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Import Squad</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Paste YASB link"
                  value={yasb}
                  onChange={e => setYasb(e.target.value)}
                />
                <InputGroup.Append>
                  <Button variant="primary" onClick={handleImport.bind(null, 'yasb')}>
                    Import YASB
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Paste XWS JSON"
                  value={xws}
                  onChange={e => setXws(e.target.value)}
                />
                <InputGroup.Append>
                  <Button variant="primary" onClick={handleImport.bind(null, 'xws')}>
                    Import XWS
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function PreGamePlayerPanel({ game, player }) {
  const state = useContext(AppContext);
  const user = state.user?.value;

  const isCurrentUser = player.user.uid === user?.uid;

  function renderSquadUpload() {
    if (isCurrentUser) {
      return <SquadImportModal game={game} player={player} />;
    }

    if (player.squad) {
      return <span>Squad Imported</span>;
    }
  }

  function renderSquadDetail() {
    if (!player.squad) {
      return null;
    }

    return (
      <>
        <hr />
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '150px' }}>
            {player.squad.pilots?.map((pilot, index) => {
              // Render each pilot
              const pilotPath = `ships.${pilot.ship}.pilots.${pilot.id}`;
              const pilotXwsData = get(data, pilotPath);
              if (!pilotXwsData) {
                return <React.Fragment key={`pilot-${index}`}>Missing Pilot: {pilotPath}</React.Fragment>;
              }

              // Collect all upgrades as list items
              let upgrades = [];
              let totalShipCost = pilotXwsData.cost ?? 0;

              pilot.upgrades &&
                Object.entries(pilot.upgrades).forEach(([upgradeType, upgradesOfType], index) => {
                  // XWS stores upgrades as type -> list of upgrades of that type
                  upgradesOfType &&
                    upgradesOfType.forEach((upgrade, subIndex) => {
                      const upgradePath = `upgrades.${upgradeType}.${upgrade}`;
                      const upgradeXwsData = get(data, upgradePath);
                      if (upgradeXwsData) {
                        totalShipCost += upgradeXwsData.cost?.value ?? 0;
                        upgrades.push(
                          <li key={`upgrade-${index}-${subIndex}`}>
                            <XWSTooltip xwsPath={upgradePath}>
                              {upgradeXwsData.name} ({upgradeXwsData.cost?.value ?? '?'})
                            </XWSTooltip>
                          </li>
                        );
                      } else {
                        upgrades.push(<li key={`upgrade-${index}-${subIndex}`}>`(missing) ${upgradePath}`</li>);
                      }
                    });
                });

              // Render the pilot and the upgrades list
              return (
                <React.Fragment key={`pilot-${index}`}>
                  <XWSTooltip xwsPath={pilotPath}>
                    {pilotXwsData.name} ({pilotXwsData.cost ?? '?'}) [Total: {totalShipCost}]
                  </XWSTooltip>
                  <ul>{upgrades}</ul>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <Media>
      <UserImage user={player.user} width={64} height={64} />
      <Media.Body>
        <div>
          <div className="align-middle">{player.user.displayName}</div>
          <div className="align-middle">Name: {player.squad?.name ?? 'Unnamed Squadron'}</div>
          <div className="align-middle">Faction: {player.squad?.faction}</div>
          <div className="align-middle">Points: {player.squad?.points}</div>
        </div>
        {renderSquadDetail()}
      </Media.Body>
      {renderSquadUpload()}
    </Media>
  );
}

function PreGamePanel({ game }) {
  const state = useContext(AppContext);

  const players = game.players ? Object.entries(game.players) : [];

  function canStart() {
    const minPlayers = players.length > 1 || game.maxPlayers === 1;
    const allSquads = players.every(p => p[1].squad);
    return minPlayers && allSquads;
  }

  function startGame() {
    if (canStart()) {
      state.games.start(game.id);
    }
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexFlow: 'column', height: '100%' }}>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>{game.name}</Navbar.Brand>
        <Navbar.Collapse />
        <Form inline onSubmit={e => e.preventDefault()}>
          <Button onClick={startGame} disabled={!canStart()}>
            Start Game
          </Button>
        </Form>
      </Navbar>
      <Container fluid style={{ paddingTop: '10px' }}>
        <Row style={{ height: '100%' }}>
          <Col xs="6">
            <Navbar bg="light" variant="light">
              <Navbar.Brand>Players</Navbar.Brand>
              <Navbar.Collapse />
              <Navbar.Brand>{`${players?.length ?? 0}/${game.maxPlayers}`}</Navbar.Brand>
            </Navbar>
            {players.map(([playerId, player]) => {
              return <PreGamePlayerPanel key={playerId} game={game} player={player} />;
            })}
          </Col>
          <Col>{/* TODO: Squad summary on player select */}</Col>
        </Row>
      </Container>
    </div>
  );
}

export default function({ gameId }) {
  const state = useContext(AppContext);

  const gamesLoading = state.games?.loading;
  const game = state.games?.value?.find(g => g.id === gameId);

  function renderInner() {
    if (gamesLoading) {
      return (
        <Spinner style={{ margin: 'auto', height: '6rem', width: '6rem', borderWidth: '.15rem' }} animation="border" />
      );
    }

    if (!game) {
      return <h1>Game Not Found</h1>;
    }

    return game.isStarted ? <InGamePanel game={game} /> : <PreGamePanel game={game} />;
  }

  return (
    <Container fluid={true} style={{ height: '100%', paddingTop: '70px', paddingBottom: '15px' }}>
      <Row style={{ height: '100%' }}>{renderInner()}</Row>
    </Container>
  );
}
