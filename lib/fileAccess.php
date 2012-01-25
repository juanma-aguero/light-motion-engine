<?php

class DataBase {
	
	private static $file = "lib/rankingPija.txt";
	private static $delimiter = "|";
	
	/*
	 *	Function for rank a user
	 */
	public static function savePoints( $user, $points){
		
		$ranking = self::getRanking();
		$id = ( count($ranking) +1);
		
		// add user to ranking
		$ranking[] = array('id' => $id, 'username' => $user, 'points' => $points);
		
		// sort ranking
		$sortedRanking = self::sortRanking( $ranking );
		
		$fh = fopen(self::$file, 'w') or die("can't open file");
		$position = 1;
		foreach($sortedRanking as $row){
			if( $row['id'] == $id ){
				$userRanking = $position;
			}
			$stringData = $row['id'].",".$row['username'].",".$row['points'].self::$delimiter;
			fwrite($fh, $stringData);
			$position++;
		}
		
		fclose($fh);
		return ($position-1);
	}
	
	/*
	 *	Function for returning a sorted by points ranking
	 */
	public static function getRanking(){
		// access data
		$gestor = fopen(self::$file, "r");
		if(filesize(self::$file) > 0){
			$contenido = fread($gestor, filesize(self::$file));
			$delimiter = "|";
			$arr = explode ( $delimiter , substr($contenido, 0, -1) );
		}else{
			$arr = array();
		}
		fclose($gestor);

		// hidrate array
		$result = array();
		foreach($arr as $val){
			$aux = explode ( "," , $val );
			$id = $aux[0];
			$username = $aux[1];
			$points = $aux[2];
			$result[] = array('id' => $id, 'username' => $username, 'points' => $points);
		}

		// sorting array
		$sortedResult = self::sortRanking($result);
		
		// return a sorted ranking
		return $sortedResult;
		
	}
	
	
	public static function sortRanking( $ranking ){
		$points = array();
		$username = array();
		$sortedRanking = array();
		foreach ($ranking as $key => $row) {
			$ids[$key]  = $row['id'];
			$username[$key]  = $row['username'];
			$points[$key] = $row['points'];
		}
		array_multisort($points, SORT_DESC);
		foreach( $points as $key => $value){
			$sortedRanking[] = array('id' => $ids[$key], 'username' => $username[$key], 'points' => $value);
		}
		return $sortedRanking;
	}
	
}


?>
