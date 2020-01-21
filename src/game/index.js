import React, { useContext } from 'react';

import { Row } from 'react-bootstrap';

import { AppContext } from '../app/state';

function GameStatus() {
  const state = useContext(AppContext);

  // Player names + factions, time left, total points destroyed, etc
  return (
    <Row>
      
    </Row>
  );
}

function SquadPanel() {

}

function PlanningPhasePanel() {

}

function SystemPhasePanel() {

}

function ActivationPhasePanel() {

}

function EngagementPhasePanel() {

}

export default function MainPanel() {
  return (
    <GameStatus />
  );
}