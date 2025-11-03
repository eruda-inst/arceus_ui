"use client";

import Link from "next/link";
import { FaHome, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-indigo-600 dark:text-indigo-400 text-3xl" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
            404
          </h1>
          <div className="w-12 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full mx-auto"></div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Página não encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            A página que você está procurando não existe ou foi movida.
            Verifique o URL ou volte para a página inicial.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            <FaHome className="text-lg" />
            Página Inicial
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-3 border border-border-light dark:border-border-dark text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            <FaArrowLeft className="text-lg" />
            Voltar
          </button>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 pt-6 border-t border-border-light dark:border-border-dark">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Se você acredita que isso é um erro, entre em contato com o suporte.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Error 404 • Página não encontrada
          </p>
        </div>
      </div>
    </div>
  );
}

NotFound.displayName = "NotFound";
