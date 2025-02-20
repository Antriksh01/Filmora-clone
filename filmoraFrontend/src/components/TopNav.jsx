export default function TopNav() {
  return (
    <div className="flex justify-between p-4 bg-gray-900 text-white">
      <h1 className="text-lg">Shotstack Clone</h1>
      <div>
        <button className="mr-2 p-2 bg-gray-700">Design</button>
        <button className="mr-2 p-2 bg-gray-700">Connect</button>
        <button className="mr-2 p-2 bg-gray-700">Automate</button>
      </div>
    </div>
  );
}
